import adminMiddleware from '../middlewares/adminMiddleware.js';
import Product from '../models/product.js';
import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import { getMenu } from '../services/menu.js';

const router = Router();

router.get('/', async (req, res, next) => {
    const menu = await getMenu();
    if(menu) {
        res.json({
            success : true,
            menu : menu
        });
    } else {
        next({
            status : 404,
            message : 'Menu not found'
        });
    }
})
router.post('/', adminMiddleware, async (req, res) => {
    const { title, desc, price } = req.body;

    if (!title || !desc || !price) {
        return res.status(400).json({ message: 'Alla fält måste vara ifyllda' });
    }

    try {
        const newProduct = new Product({
            title,
            desc,
            price,
            prodId: uuidv4(),
            createdAt: new Date()
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({
            success: true,
            message: 'Produkt tillagd',
            product: savedProduct
        });
    } catch (err) {
        res.status(500).json({ message: 'Kunde inte spara produkten', error: err.message });
    }
});

router.put('/:prodId', adminMiddleware, async (req, res) => {
  const prodId = req.params.prodId;
  const { title, desc, price } = req.body;

  if (!title || !desc || !price) {
    return res.status(400).json({ message: 'Alla fält måste vara ifyllda' });
  }

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { prodId: prodId.trim() },
      { title, desc, price, modifiedAt: new Date() },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produkt hittades inte' });
    }

    res.json({
      success: true,
      message: 'Produkt uppdaterad',
      product: updatedProduct
    });
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte uppdatera produkten', error: err.message });
  }
});


router.delete('/:prodId', adminMiddleware, async (req, res) => {
  const prodId = req.params.prodId;

  try {
    const deletedProduct = await Product.findOneAndDelete({ prodId: prodId.trim() });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produkt hittades inte' });
    }

    res.json({
      success: true,
      message: 'Produkt borttagen',
      product: deletedProduct
    });
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte ta bort produkten', error: err.message });
  }
}
);

export default router;