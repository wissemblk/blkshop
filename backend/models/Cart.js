class Cart{
    constructor(cartData = {}){
        this.id = cartData._id || cartData.id;
        this.userId = cartData.userId;
        this.items = cartData.items || [];
        this.updatedAt = cartData.updatedAt || new Date();

    }

    addItem(product,quantity=1){
        const existingItem = this.items.find(item=> item.product === product.id);

        if(existingItem){
            existingItem.quantity +=quantity;
            existingItem.total = existingItem.quantity * existingItem.price;

        } else{
            this.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                total: product.price * quantity
            });
        }
        this.updatedAt = new Date();
        return this.items
    }

    removeItem(productId){
        this.items = this.items.filter(item => item.productId !== productId);
        this.updatedAt = new Date();
        return this.items;
    }

    updatedItem(productId,quantity){
        const item = this.items.find(item => item.productId === productId);
        if(item){
            item.quantity = quantity;
            item.total = item.price * quantity;

        }
        this.updatedAt = new Date();
        return this.items;

    }

    getTotal(){
        return this.items.reduce((total,item)=> total + item.total,0);

    }

    getItemCount(){
        return this.items.reduce((count,item)=> count + item.quantity, 0);

    }
    clear(){
        this.items = [];
        this.updatedAt = new Date();

    }

    toJSON(){
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            total: this.getTotal(),
            itemCount: this.getItemCount,
            updatedAt: this.updatedAt
        };
    }
}
module.exports = Cart;