// backend/models/Product.js
class Product {
    constructor(productData) {
        // Vérifier que productData existe et a les propriétés nécessaires
        if (!productData) {
            console.error('❌ productData est undefined ou null');
            productData = {}; // Initialiser avec un objet vide pour éviter l'erreur
        }

        this.id = productData.id || null;
        this.name = productData.name || '';
        this.price = productData.price ? parseFloat(productData.price) : 0;
        this.description = productData.description || '';
        this.image = productData.image || '';
        this.category = productData.category || '';
        this.createdAt = productData.created_at || productData.createdAt || new Date();
        this.updatedAt = productData.updated_at || productData.updatedAt || new Date();
    }

    update(data) {
        this.name = data.name || this.name;
        this.price = data.price ? parseFloat(data.price) : this.price;
        this.description = data.description || this.description;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
            image: this.image,
            category: this.category,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Product;