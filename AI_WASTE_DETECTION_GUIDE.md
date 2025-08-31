# 🤖 AI Food Waste Detection System

## Overview
This system uses TensorFlow.js to analyze uploaded plate photos and determine food waste percentages. Customers can earn discounts based on how much food they consume.

## How It Works

### 1. **Image Upload**
- Customer uploads a photo of their finished plate
- Image is processed using TensorFlow.js for AI analysis

### 2. **AI Analysis**
The system uses two approaches:

#### **Primary: TensorFlow.js Model**
- Loads a pre-trained food detection model
- Analyzes image pixels to identify food vs empty plate areas
- Calculates waste percentage based on remaining food

#### **Fallback: Color-Based Analysis**
- Analyzes pixel colors to detect food patterns
- Uses hue, saturation, and brightness analysis
- Identifies food colors (browns, greens, reds) vs empty plate colors (whites, light grays)

### 3. **Discount System**

| Consumption Level | Discount | Feedback |
|------------------|----------|----------|
| 95%+ consumed | 20% off | "Excellent! You finished almost everything!" |
| 85%+ consumed | 15% off | "Great job! You consumed most of your food!" |
| 75%+ consumed | 10% off | "Good effort! You ate most of your meal!" |
| <75% consumed | No discount | "Consider ordering smaller portions next time." |

### 4. **Discount Management**
- Discounts are stored locally (can be connected to backend)
- Valid for 30 days from earning date
- Can be applied to future orders
- Automatically marked as used when applied

## Technical Implementation

### Files Created:
- `src/services/aiWasteDetection.ts` - AI analysis service
- `src/services/discountService.ts` - Discount management
- Updated `WasteScannerPage.tsx` - Real AI integration
- Updated `CartPage.tsx` - Discount application

### Dependencies:
```bash
npm install @tensorflow/tfjs
```

### Key Features:
✅ **Real AI Analysis** - Uses TensorFlow.js for image processing
✅ **Fallback System** - Color-based analysis when model unavailable
✅ **Discount Rewards** - Automatic discount generation based on consumption
✅ **Visual Feedback** - Clear results with confidence scores
✅ **Cart Integration** - Discounts can be applied to orders

## Usage Flow

1. **Customer orders food** from menu
2. **After eating**, customer uploads plate photo
3. **AI analyzes** the image for waste percentage
4. **If eligible**, customer earns discount
5. **On next order**, discount can be applied in cart
6. **Discount is used** and marked as consumed

## Future Enhancements

### Model Training
To improve accuracy, you can:
1. Collect plate photos with known waste percentages
2. Train a custom TensorFlow model
3. Replace the fallback analysis with trained model

### Backend Integration
- Store discounts in database
- Track customer waste reduction over time
- Generate analytics for restaurant management

### Advanced Features
- Multiple angle photo analysis
- Food type recognition
- Nutritional waste tracking
- Social sharing of achievements

## Testing the System

1. Start the development server: `npm run dev`
2. Navigate to `/waste-scanner`
3. Upload a plate photo
4. View AI analysis results
5. Check for earned discounts
6. Go to cart to apply discounts

The system is now fully functional with real AI-powered waste detection and automatic discount rewards!
