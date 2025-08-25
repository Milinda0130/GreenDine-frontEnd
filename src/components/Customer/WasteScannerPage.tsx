import React, { useState } from 'react';
import { Camera, Upload, Award, TrendingDown, Leaf } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const WasteScannerPage: React.FC = () => {
  const { submitWasteAnalysis, wasteAnalyses } = useApp();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    wastePercentage: number;
    pointsEarned: number;
    feedback: string;
  } | null>(null);

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
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI results - in reality this would come from TensorFlow CNN
    const wastePercentage = Math.random() * 30; // 0-30% waste
    const pointsEarned = wastePercentage < 10 ? 20 : wastePercentage < 20 ? 10 : 5;
    
    let feedback = '';
    if (wastePercentage < 5) {
      feedback = 'Excellent! Almost no food waste detected. You\'re making a great environmental impact!';
    } else if (wastePercentage < 15) {
      feedback = 'Good job! Low food waste detected. Keep up the sustainable dining habits!';
    } else {
      feedback = 'There\'s room for improvement. Consider ordering smaller portions next time to reduce waste.';
    }

    const result = {
      wastePercentage: Math.round(wastePercentage * 100) / 100,
      pointsEarned,
      feedback
    };

    setAnalysisResult(result);
    
    submitWasteAnalysis({
      customerId: user.id,
      orderId: 'mock-order-id',
      imageUrl: selectedImage,
      wastePercentage: result.wastePercentage,
      aiConfidence: 0.85,
      pointsEarned: result.pointsEarned,
      feedback: result.feedback
    });
    
    setAnalyzing(false);
  };

  const userAnalyses = wasteAnalyses.filter(analysis => analysis.customerId === user?.id);
  const averageWaste = userAnalyses.length > 0 
    ? userAnalyses.reduce((sum, analysis) => sum + analysis.wastePercentage, 0) / userAnalyses.length
    : 0;
  const totalPoints = userAnalyses.reduce((sum, analysis) => sum + analysis.pointsEarned, 0);

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
            <p className="text-green-100 text-lg">Upload photos of your finished plate to track food waste and earn rewards!</p>
          </div>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Waste</p>
                <p className="text-2xl font-bold text-gray-900">{averageWaste.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-100">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
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
                        <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Analysis Complete!</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-green-700">Food Waste Detected</p>
                            <p className="text-2xl font-bold text-green-900">{analysisResult.wastePercentage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-green-700">Points Earned</p>
                            <p className="text-2xl font-bold text-green-900">+{analysisResult.pointsEarned}</p>
                          </div>
                        </div>
                        <p className="text-green-800">{analysisResult.feedback}</p>
                        
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
                      <div className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        +{analysis.pointsEarned} points
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