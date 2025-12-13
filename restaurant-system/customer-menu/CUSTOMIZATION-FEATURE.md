# 🎨 Item Customization Feature

## Overview
Added a comprehensive item customization modal that allows customers to personalize their orders with add-ons, size selection, spice levels, modifications, and special instructions.

## Features Implemented

### 1. **Customization Modal Component** (`components/ItemCustomizationModal.tsx`)

#### Size Selection
- Small (80% of base price)
- Medium (100% of base price) - Default
- Large (130% of base price)

#### Spice Level Options
- No Spice 😊
- Mild 🌶️
- Medium 🌶️🌶️
- Hot 🌶️🌶️🌶️
- Extra Hot 🔥🔥🔥

#### Category-Specific Add-ons

**Burgers & Sandwiches:**
- Extra Cheese ($1.50)
- Bacon ($2.00)
- Avocado ($2.50)
- Fried Egg ($1.50)
- Grilled Onions ($1.00)
- Jalapeños ($1.00)

**Pizza:**
- Extra Cheese ($2.00)
- Pepperoni ($2.50)
- Mushrooms ($1.50)
- Olives ($1.50)
- Bell Peppers ($1.50)
- Italian Sausage ($2.50)

**Pasta:**
- Grilled Chicken ($3.00)
- Shrimp ($4.00)
- Extra Parmesan ($1.50)
- Garlic Bread ($2.50)

**Salads:**
- Grilled Chicken ($3.00)
- Grilled Salmon ($5.00)
- Avocado ($2.50)
- Feta Cheese ($2.00)
- Boiled Egg ($1.50)

**Default (All Items):**
- Extra Sauce ($0.50)
- Side Salad ($3.00)
- French Fries ($3.50)
- Coleslaw ($2.50)

#### Common Modifications
- No Onions
- No Tomatoes
- No Lettuce
- No Pickles
- Extra Sauce
- Less Salt
- Well Done
- Light Oil

#### Special Instructions
- Free-form text area for any custom requests
- Perfect for allergies and dietary restrictions

### 2. **Enhanced Cart Display**
The cart page now shows all customization details:
- Selected size
- Spice level
- All add-ons
- Modifications
- Special instructions

### 3. **Smart Pricing**
- Automatically calculates total based on:
  - Base item price × size multiplier
  - All selected add-ons
  - Quantity
- Real-time price updates as options are selected

### 4. **User Experience Features**
- Beautiful modal with item image
- Visual selection indicators
- Quantity controls within modal
- Quick preview of selections
- Responsive design for mobile and desktop

## How to Use

### For Customers:
1. Browse menu on homepage (http://localhost:3003)
2. Click "🛒 Add to Cart" on any item
3. Customize your order:
   - Choose size
   - Select spice level (if applicable)
   - Add any extras
   - Pick modifications
   - Add special notes
4. Adjust quantity if needed
5. Click "Add to Cart - $XX.XX"
6. View full order details in cart

### For Developers:
1. Modal component: `restaurant-system/customer-menu/components/ItemCustomizationModal.tsx`
2. Integration: `restaurant-system/customer-menu/app/page.tsx`
3. Cart display: `restaurant-system/customer-menu/app/cart/page.tsx`
4. Store types: `restaurant-system/customer-menu/lib/store.ts`

## Technical Details

### Data Structure
```typescript
{
  id: string,
  name: string,
  price: number,
  customizations: {
    size: 'small' | 'medium' | 'large',
    sizeMultiplier: number,
    spiceLevel: string,
    addOns: Array<{
      id: string,
      name: string,
      price: number,
      category: string
    }>,
    modifications: string[],
    specialInstructions: string
  }
}
```

### Backend Compatibility
- Customizations are stored in `OrderItem.customizations` field (JSON)
- Special instructions stored in `OrderItem.specialInstructions`
- Fully compatible with existing database schema

## Future Enhancements (Ideas)

1. **Save Favorite Customizations**
   - "Save as favorite" button
   - Quick reorder with same customizations

2. **Dynamic Add-ons from Backend**
   - Admin can manage add-ons via admin panel
   - Database-driven instead of hardcoded

3. **Visual Customization**
   - Image preview showing customizations
   - "Build your own" visual editor

4. **Combo Deals**
   - Suggest complementary items
   - Bundle pricing

5. **Allergen Warnings**
   - Show allergen alerts based on selections
   - Smart filtering

## Testing

Test the feature with these scenarios:
1. ✅ Add item with all customizations
2. ✅ Add item with size only
3. ✅ Add multiple quantities
4. ✅ View customizations in cart
5. ✅ Calculate correct total price
6. ✅ Place order with customizations

## Notes

- Each customized item gets a unique ID to handle multiple instances
- Prices are calculated per item, not total
- Add-ons are category-specific for better relevance
- Modal is fully responsive and accessible
