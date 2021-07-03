import React from 'react';
import { getProductsById } from '../database/database';
import { tools } from '../tools/Tools';



class Calculate{
    cart;
    setCart;
    products;
    setProducts;
    net;
    setNet;
    tax;
    setTax;
    discount;
    setDiscount;
    total;
    setTotal;
    settings;
    setSettings;

    initCart(cart, setCart){
        this.cart = cart;
        this.setCart = setCart;
    }
    initProducts(products, setProducts){
        this.products = products;
        this.setProducts = setProducts;
    }
    initNet(net, setNet){
        this.net = net;
        this.setNet = setNet;
    }
    initTax(tax, setTax){
        this.tax = tax;
        this.setTax = setTax;
    }
    initDiscount(discount, setDiscount){
        this.discount = discount;
        this.setDiscount = setDiscount;
    }
    initTotal(total, setTotal){
        this.total = total;
        this.setTotal = setTotal;
    }
    initSettings(settings, setSettings){
        this.settings = settings;
        this.setSettings = setSettings;
    }

    percentOf(percent, value){
        return ((parseFloat(value) / 100) * parseFloat(percent));
    }

    updateCartQty = (item,value=null) =>{
        let tempCart = [];
        for (let cartItem of this.cart){
            if (cartItem?.id === item?.id){
                if (value) cartItem["qty"] = value;
                else cartItem["qty"] = parseInt(cartItem["qty"]) +1;
                if (tools.isMobile()) tools.toast(`(${item?.info?.title}) quantity changed to ${cartItem["qty"]}`);
            }
            tempCart.push(cartItem);
        }
        this.setCart(tempCart);
    }

    addToCart = (item) =>{
        const qtyMessage = "No more item in stock";
        const noStockErr = () =>tools.toast(qtyMessage,"warning",3000);
        for (let cartItem of this.cart){
            if (cartItem?.id === item?.id){
                if (parseInt(cartItem?.qty) >= parseInt(item?.info?.qty)) return noStockErr();
                return this.updateCartQty(item);
            }
        }
        if (parseInt(item?.info?.qty) <= 0) return noStockErr();
        if (tools.isMobile()) tools.toast(`(${item?.info?.title}) was added`);
        let newItem = JSON.parse(JSON.stringify(item));
        newItem["qty"] = 1;
        delete newItem?.info["image"];
        delete newItem?.info["costPrice"];
        this.setCart([newItem,...this.cart]);
    }

    addMostRecentToCart = async(item) =>{
        for (let cartProd of this.cart){//first check cart if item included
            if (cartProd?.id === item?.id) return this.addToCart(cartProd);
        }
        for (let inProd of this.products){//then check products for item included
            if (inProd?.id === item?.id) return this.addToCart(inProd);
        }
        const prod = await getProductsById(item?.id);//check if avaible in database if above fail
        if (Object.keys(prod || {}).length) this.addToCart({info:prod,id:item?.id});
        return prod;
    }

    deleteFromCart = (item) =>{
        let tempCart = [];
        for (let cartItem of this.cart){
            if (cartItem?.id !== item?.id) tempCart.push(cartItem);
        }
        this.setCart(tempCart);
    }

    caclulate = () =>{
        let sub = 0;
        //calculate cost of sales items (cart or sales from database)
        for (let cartItem of this.cart){
            if (!cartItem?.info?.type){
                let qty = parseFloat(cartItem?.qty);
                let price = parseFloat(cartItem?.info?.salePrice);
                sub = sub + (price * qty);
            }
        }
        //calculate tax of total
        let tempTax = this.percentOf(this.settings?.tax || 0, sub);

        let disc = 0;
        //calculate discounts if added in sales
        for (let cartItem of this.cart){
            if (cartItem?.info?.type){
                if (cartItem?.info?.type?.includes("%")){
                    let discAmount = parseFloat(cartItem?.info?.discount);
                    disc += (((sub + tempTax) / 100) * parseFloat(discAmount) || 0);
                }if (cartItem?.info?.type?.includes("$")){
                    disc += parseFloat(cartItem?.info?.discount);
                }
            }
        }
        this.setNet(sub);
        this.setTax(tempTax);
        this.setDiscount(disc);
        this.setTotal((sub + tempTax) - disc);
    }
}

export const calc = new Calculate();