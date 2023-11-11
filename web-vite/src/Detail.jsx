import {
  Divider,
  Image,
  Price,
  Button,
  Badge,
  Toast,
} from "@nutui/nutui-react";
import { Cart } from "@nutui/icons-react";

import { getCartGoodsCount } from "./utils";

export default function Detail({
  setDialogContent,
  goods,
  setCartGoods,
  cartGoods,
  countDown,
}) {
  function toCart() {
    setDialogContent("购物车");
  }

  function addToCart() {
    const index = cartGoods.findIndex((e) => e.goods.track === goods.track);
    if (index === -1) {
      cartGoods.push({ goods, count: 1 });
    } else {
      if (goods.stock > cartGoods[index].count) {
        cartGoods[index] = { goods, count: cartGoods[index].count + 1 };
      } else {
        Toast.show("库存不足");
      }
    }
    setCartGoods([...cartGoods]);
  }

  const count = getCartGoodsCount(cartGoods);

  return (
    <div className="detail tw-flex tw-flex-col tw-w-full tw-h-full tw-text-2xl tw-bg-slate-100 tw-overflow-hidden">
      <div className="tw-bg-white tw-p-4 tw-border-b tw-border-slate-300 tw-shadow">
        <h1 className="tw-text-center">
          商品详情
          {countDown < 11 && (
            <span className="tw-text-xl tw-ml-2">{`(${countDown}秒后返回)`}</span>
          )}
        </h1>
      </div>
      <div className="tw-w-full tw-overflow-y-scroll tw-p-4 tw-flex-1">
        <Image src={goods.mainImg} width="100%" />
        <div className="tw-mt-2 tw-w-full">
          <Price price={goods.price / 100} />
          {goods.originalPrice && (
            <Price price={goods.originalPrice / 100} className="tw-ml-4" line />
          )}
        </div>
        <div className="tw-text-left tw-w-full tw-font-bold">{goods.name}</div>
        <div className="tw-w-full tw-flex tw-mt-4">
          货道
          <div className="track tw-mx-4 tw-px-2 tw-rounded tw-font-bold">
            {goods.track}
          </div>
          仅剩{goods.stock}件
        </div>
        <Divider />
        {goods.images.length ? (
          <div className="tw-w-full tw-mb-2">更多图片：</div>
        ) : (
          <></>
        )}
        {goods.images.map((image, index) => (
          <Image src={image} width="100%" key={index} />
        ))}
      </div>

      <div className="tw-w-full tw-bg-white tw-p-4 tw-flex tw-border-t tw-border-slate-300 tw-shadow tw-justify-between">
        {count ? (
          <Badge value={getCartGoodsCount(cartGoods)}>
            <Button
              size="large"
              className="cart"
              icon={<Cart width={18} />}
              onClick={toCart}
            >
              购物车
            </Button>
          </Badge>
        ) : (
          <Button
            size="large"
            className="cart"
            icon={<Cart width={18} />}
            onClick={toCart}
            disabled
          >
            购物车
          </Button>
        )}

        <Button type="warning" size="large" onClick={addToCart}>
          加入购物车
        </Button>
      </div>
    </div>
  );
}
