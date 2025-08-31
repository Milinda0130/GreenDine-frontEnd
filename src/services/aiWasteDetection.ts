import * as tf from '@tensorflow/tfjs';

export interface WasteAnalysisResult {
  wastePercentage: number;
  confidence: number;
  feedback: string;
  discountEligible: boolean;
  discountAmount: number;
  consumedPercentage: number;
}

export interface PlateAnalysis {
  totalPixels: number;
  foodPixels: number;
  emptyPixels: number;
  wastePixels: number;
}

class AIWasteDetectionService {
  private model: tf.GraphModel | null = null;
  private isModelLoaded = false;

  async initializeModel() {
    try {
      // Load a pre-trained model for food detection
      // You can use a custom trained model or a general object detection model
      this.model = await tf.loadGraphModel('/models/food-waste-detection/model.json');
      this.isModelLoaded = true;
      console.log('AI model loaded successfully');
    } catch (error) {
      console.warn('Could not load custom model, using fallback analysis:', error);
      this.isModelLoaded = false;
    }
  }

  async analyzePlateImage(imageElement: HTMLImageElement): Promise<WasteAnalysisResult> {
    if (!this.isModelLoaded) {
      return this.fallbackAnalysis(imageElement);
    }

    try {
      // Preprocess the image
      const tensor = tf.browser.fromPixels(imageElement)
        .expandDims(0)
        .div(255.0);

      // Run inference
      const predictions = await this.model!.predict(tensor) as tf.Tensor;
      const results = await predictions.array();

      // Clean up tensors
      tensor.dispose();
      predictions.dispose();

      return this.processResults(results[0], imageElement);
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      return this.fallbackAnalysis(imageElement);
    }
  }

  private async fallbackAnalysis(imageElement: HTMLImageElement): Promise<WasteAnalysisResult> {
    // Create a canvas to analyze the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const analysis = this.analyzeImagePixels(imageData);

    return this.calculateWasteResult(analysis);
  }

  private analyzeImagePixels(imageData: ImageData): PlateAnalysis {
    const { data, width, height } = imageData;
    let totalPixels = 0;
    let foodPixels = 0;
    let emptyPixels = 0;
    let wastePixels = 0;

    // Analyze each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a > 0) { // Non-transparent pixel
        totalPixels++;
        
        // Simple color-based analysis
        // This is a basic heuristic - in a real implementation, you'd use a trained model
        const brightness = (r + g + b) / 3;
        const saturation = Math.max(r, g, b) - Math.min(r, g, b);
        
        // Detect food vs empty plate based on color patterns
        if (this.isFoodPixel(r, g, b)) {
          foodPixels++;
        } else if (this.isEmptyPlatePixel(r, g, b)) {
          emptyPixels++;
        } else {
          wastePixels++;
        }
      }
    }

    return {
      totalPixels,
      foodPixels,
      emptyPixels,
      wastePixels
    };
  }

  private isFoodPixel(r: number, g: number, b: number): boolean {
    // Detect food colors (browns, greens, reds, etc.)
    const hue = this.rgbToHue(r, g, b);
    const saturation = this.calculateSaturation(r, g, b);
    const brightness = (r + g + b) / 3;

    // Food typically has medium to high saturation and specific hue ranges
    return (
      (hue >= 0 && hue <= 60) || // Reds to yellows (meat, vegetables)
      (hue >= 90 && hue <= 150) || // Greens (vegetables)
      (hue >= 180 && hue <= 240) || // Blues (some foods)
      (brightness > 50 && saturation > 30) // Generally colorful foods
    );
  }

  private isEmptyPlatePixel(r: number, g: number, b: number): boolean {
    // Detect empty plate colors (whites, light grays, etc.)
    const brightness = (r + g + b) / 3;
    const saturation = this.calculateSaturation(r, g, b);

    return brightness > 200 && saturation < 20; // Very light, low saturation
  }

  private rgbToHue(r: number, g: number, b: number): number {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    if (diff === 0) return 0;

    let hue = 0;
    switch (max) {
      case r:
        hue = ((g - b) / diff) % 6;
        break;
      case g:
        hue = (b - r) / diff + 2;
        break;
      case b:
        hue = (r - g) / diff + 4;
        break;
    }

    return hue * 60;
  }

  private calculateSaturation(r: number, g: number, b: number): number {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : ((max - min) / max) * 100;
  }

  private calculateWasteResult(analysis: PlateAnalysis): WasteAnalysisResult {
    const { totalPixels, foodPixels, emptyPixels, wastePixels } = analysis;
    
    if (totalPixels === 0) {
      return {
        wastePercentage: 0,
        confidence: 0,
        feedback: 'Unable to analyze image',
        discountEligible: false,
        discountAmount: 0,
        consumedPercentage: 0
      };
    }

    // Calculate percentages
    const foodPercentage = (foodPixels / totalPixels) * 100;
    const emptyPercentage = (emptyPixels / totalPixels) * 100;
    const wastePercentage = (wastePixels / totalPixels) * 100;
    const consumedPercentage = 100 - wastePercentage;

    // Determine discount eligibility and amount
    let discountEligible = false;
    let discountAmount = 0;
    let feedback = '';

    if (consumedPercentage >= 95) {
      discountEligible = true;
      discountAmount = 20; // 20% discount for eating almost everything
      feedback = 'Excellent! You finished almost everything on your plate. You\'ve earned a 20% discount for your sustainable dining habits!';
    } else if (consumedPercentage >= 85) {
      discountEligible = true;
      discountAmount = 15; // 15% discount
      feedback = 'Great job! You consumed most of your food. You\'ve earned a 15% discount for reducing food waste!';
    } else if (consumedPercentage >= 75) {
      discountEligible = true;
      discountAmount = 10; // 10% discount
      feedback = 'Good effort! You ate most of your meal. You\'ve earned a 10% discount for your sustainable choices!';
    } else if (consumedPercentage >= 50) {
      discountEligible = false;
      discountAmount = 0;
      feedback = 'There\'s room for improvement. Consider ordering smaller portions next time to reduce waste.';
    } else {
      discountEligible = false;
      discountAmount = 0;
      feedback = 'Significant food waste detected. Please consider the environmental impact of food waste.';
    }

    // Calculate confidence based on analysis quality
    const confidence = Math.min(95, 70 + (totalPixels / 10000)); // Higher confidence with more pixels

    return {
      wastePercentage: Math.round(wastePercentage * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      feedback,
      discountEligible,
      discountAmount,
      consumedPercentage: Math.round(consumedPercentage * 100) / 100
    };
  }

  private processResults(results: any[], imageElement: HTMLImageElement): WasteAnalysisResult {
    // Process model predictions and convert to waste analysis
    // This would be specific to your trained model's output format
    const wastePercentage = Math.random() * 30; // Placeholder
    const consumedPercentage = 100 - wastePercentage;

    let discountEligible = false;
    let discountAmount = 0;
    let feedback = '';

    if (consumedPercentage >= 95) {
      discountEligible = true;
      discountAmount = 20;
      feedback = 'Excellent! You finished almost everything on your plate. You\'ve earned a 20% discount!';
    } else if (consumedPercentage >= 85) {
      discountEligible = true;
      discountAmount = 15;
      feedback = 'Great job! You consumed most of your food. You\'ve earned a 15% discount!';
    } else if (consumedPercentage >= 75) {
      discountEligible = true;
      discountAmount = 10;
      feedback = 'Good effort! You ate most of your meal. You\'ve earned a 10% discount!';
    } else {
      feedback = 'There\'s room for improvement. Consider ordering smaller portions next time.';
    }

    return {
      wastePercentage: Math.round(wastePercentage * 100) / 100,
      confidence: 85,
      feedback,
      discountEligible,
      discountAmount,
      consumedPercentage: Math.round(consumedPercentage * 100) / 100
    };
  }
}

export const aiWasteDetectionService = new AIWasteDetectionService();
