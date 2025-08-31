import React, { useState, useEffect } from 'react';
import { Camera, Upload, Award, TrendingDown, Leaf, Gift, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { aiWasteDetectionService, WasteAnalysisResult } from '../../services/aiWasteDetection';
import { discountService } from '../../services/discountService';

export const WasteScannerPage: React.FC = () => {
  const { submitWasteAnalysis, wasteAnalyses } = useApp();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisResult | null>(null);
  const [isModelInitialized, setIsModelInitialized] = useState(false);

  // Initialize AI model on component mount
  useEffect(() => {
    const initializeAI = async () => {
      try {
        await aiWasteDetectionService.initializeModel();
        setIsModelInitialized(true);
      } catch (error) {
        console.error('Failed to initialize AI model:', error);
        setIsModelInitialized(true); // Still allow fallback analysis
      }
    };
    initializeAI();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWaste = async () => {
    if (!selectedImage || !user) return;

    setAnalyzing(true);
    
    try {
      // Create an image element for analysis
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        try {
          // Use real AI analysis
          const result = await aiWasteDetectionService.analyzePlateImage(img);
          
          setAnalysisResult(result);
          
          // Submit analysis to backend
          submitWasteAnalysis({
            customerId: user.id,
            orderId: 'mock-order-id',
            imageUrl: selectedImage,
            wastePercentage: result.wastePercentage,
            aiConfidence: result.confidence / 100,
            feedback: result.feedback
          });

          // Create discount if eligible
          if (result.discountEligible) {
            try {
              await discountService.createDiscount({
                customerId: user.id,
                amount: result.discountAmount,
                reason: `Waste reduction reward - ${result.consumedPercentage}% consumed`,
                expiresDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
              });
            } catch (error) {
              console.error('Failed to create discount:', error);
            }
          }
        } catch (error) {
          console.error('AI analysis failed:', error);
          setAnalysisResult({
            wastePercentage: 0,
            confidence: 0,
            feedback: 'Analysis failed. Please try again.',
            discountEligible: false,
            discountAmount: 0,
            consumedPercentage: 0
          });
        } finally {
          setAnalyzing(false);
        }
      };
      
      img.onerror = () => {
        setAnalysisResult({
          wastePercentage: 0,
          confidence: 0,
          feedback: 'Failed to load image for analysis.',
          discountEligible: false,
          discountAmount: 0,
          consumedPercentage: 0
        });
        setAnalyzing(false);
      };
      
      img.src = selectedImage;
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalyzing(false);
    }
  };

  const userAnalyses = wasteAnalyses.filter(analysis => analysis.customerId === user?.id);
  const averageWaste = userAnalyses.length > 0 
    ? userAnalyses.reduce((sum, analysis) => sum + analysis.wastePercentage, 0) / userAnalyses.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-2xl p-12 mb-8 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200)'
            }}
          ></div>
          <div className="relative text-center">
            <Camera className="h-12 w-12 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">AI Waste Scanner</h1>
                            <p className="text-green-100 text-lg">Upload photos of your finished plate to track food waste and contribute to sustainability!</p>
          </div>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Waste</p>
                <p className="text-2xl font-bold text-gray-900">{averageWaste.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scans Completed</p>
                <p className="text-2xl font-bold text-gray-900">{userAnalyses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Scan Your Plate</h2>
          
          <div className="space-y-6">
            {!selectedImage ? (
              <div className="border-2 border-dashed border-green-300 rounded-xl p-12 text-center bg-gradient-to-br from-green-50 to-yellow-50">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload a photo of your finished plate</h3>
                <p className="text-gray-600 mb-4">Take a clear photo showing any leftover food</p>
                
                <label className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Uploaded plate"
                    className="w-full max-w-md mx-auto rounded-xl shadow-lg border border-gray-200"
                  />
                </div>
                
                {!analyzing && !analysisResult && (
                  <div className="text-center">
                    <button
                      onClick={analyzeWaste}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Analyze Waste
                    </button>
                  </div>
                )}
                
                {analyzing && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 rounded-lg shadow-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      AI is analyzing your plate...
                    </div>
                  </div>
                )}
                
                {analysisResult && (
                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg ${
                          analysisResult.discountEligible 
                            ? 'bg-gradient-to-r from-green-600 to-green-700' 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}>
                          {analysisResult.discountEligible ? (
                            <Gift className="h-6 w-6 text-white" />
                          ) : (
                            <Award className="h-6 w-6 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Analysis Complete!</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-green-700">Food Waste</p>
                            <p className="text-2xl font-bold text-green-900">{analysisResult.wastePercentage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-green-700">Consumed</p>
                            <p className="text-2xl font-bold text-green-900">{analysisResult.consumedPercentage}%</p>
                          </div>
                        </div>

                        {analysisResult.discountEligible && (
                          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-800">
                                Congratulations! You've earned a {analysisResult.discountAmount}% discount!
                              </span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              Your sustainable dining habits have earned you a discount on your next order.
                            </p>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">AI Confidence: {analysisResult.confidence}%</p>
                          <p className="text-green-800">{analysisResult.feedback}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setAnalysisResult(null);
                          }}
                          className="mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                          Scan Another Plate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Scans */}
        {userAnalyses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Scans</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {userAnalyses.slice(0, 5).map(analysis => (
                <div key={analysis.id} className="px-6 py-4 flex items-center space-x-4">
                  <img
                    src={analysis.imageUrl}
                    alt="Scanned plate"
                    className="h-16 w-16 object-cover rounded-lg shadow-sm border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">Waste: {analysis.wastePercentage}%</p>
                        <p className="text-sm text-gray-600">
                          {analysis.timestamp.toLocaleDateString()} at {analysis.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};