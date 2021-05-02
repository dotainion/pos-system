import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { AddProducts } from '../components/AddProducts';
import { MenuBarWrapper } from '../components/MenuBar';
import { getProducts } from '../database/database';
import img from '../images/beach.jpg';



export const Products = () =>{
    const [showAddProducts, setShowAddProducts] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState({});

    //this is a test
    const [products, setProducts] = useState([]);

    //this is a test
    const onGetProduts = async() =>{
        setProducts(await getProducts());
    }
    //this is a test
    useEffect(()=>{
        onGetProduts();
    },[]);
    return(
        <IonPage>
            <AddProducts
                isOpen={showAddProducts}
                record={selectedRecord}
                onClose={()=>setShowAddProducts(false)}
            />
            <MenuBarWrapper onAdd={()=>setShowAddProducts(true)} onSearch>
                <IonList class="item-container">
                    {
                        products?.length?
                        products.map((prod, key)=>(
                            <div onClick={()=>{setSelectedRecord(prod);setShowAddProducts(true)}} className="item-info-container" key={key}>
                                <div className="flex item-sub-info-container">
                                    <IonThumbnail>
                                        <IonImg class="max-size" src={prod?.info?.image || img}/>
                                    </IonThumbnail>
                                    <div>
                                        <div>{prod?.info?.title}</div>
                                        <div>{prod?.info?.costPrice}</div>
                                        <div>{prod?.info?.salePrice}</div>
                                        <div>{prod?.info?.qty}</div>
                                    </div>
                                </div>
                            </div>
                        )):
                        <IonList>
                            <IonLabel>No Empolyee</IonLabel>
                        </IonList>
                    }
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}