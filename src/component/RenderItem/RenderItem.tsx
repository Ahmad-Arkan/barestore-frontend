"use client";
import { useEffect, useState } from "react";
import { getProducts, getStoreProfile } from "@/lib/api/profile";
import styles from "./RenderItem.module.css";
import Image from "next/image";
import Icon from "../Icon/Icon";
import { useRouter } from "next/navigation";
import ContextMenu from "../ContextMenu/ContextMenu";

export default function RenderItem() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>();
  const [store, setStore] = useState<StoreProfile>();

  const ContextMenuProps = [
    { id: 1, icon: "edit", title: "Edit", action: <div>Edit Action</div> },
    {
      id: 2,
      icon: "delete",
      title: "Delete",
      action: <div>Delete Action</div>,
    },
  ];

  const openItem = (productId: number, storeId: number | undefined) => {
    router.push(`/products/${productId}.${storeId}`);
  };

  const openContextMenu = (id: number) => {
    console.log(`Context menu for ${id}`);
  };

  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    try {
      const data = await getStoreProfile();
      setStore(data);
    } catch (error) {
      console.error("Error fetching store profile:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.parent}>
      <div className={styles.info}>
        <span>Name</span>
        <span>Last Updated</span>
      </div>
      <ul className={styles.itemList}>
        {products?.map((data) => (
          <li
            className={styles.item}
            key={data.id}
            onDoubleClick={() => openItem(data.id, store?.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              openContextMenu(data.id);
            }}
          >
            <div className={styles.itemTitle}>
              <Image
                src={data.images[0]}
                width={32}
                height={32}
                alt="Thumbnail"
                unoptimized
              />
              <h3>{data.title}</h3>
            </div>
            <div className={styles.itemDescription}>
              <span>29/11/2025</span>
              <ContextMenu type="dobleClick" items={ContextMenuProps}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openContextMenu(data.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <Icon name="dots" width={20} />
                </button>
              </ContextMenu>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
