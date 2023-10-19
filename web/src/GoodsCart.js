import { Button, InputNumber, Image, Price } from "@nutui/nutui-react";

import { getTotalPrice } from "./utils";

export default function GoodsCart({
  setDialogContent,
  setCartGoods,
  cartGoods,
  clearCart,
  countDown,
}) {
  function toBuy() {
    setDialogContent("结算");
  }

  function updateCount(value, index) {
    const count = Number.parseInt(value);
    if (count === 0) {
      cartGoods = cartGoods.filter((_, i) => i !== index);
      if (cartGoods.length === 0) setDialogContent(null);
    } else {
      cartGoods[index] = {
        goods: cartGoods[index].goods,
        count,
      };
    }

    setCartGoods([...cartGoods]);
  }

  return (
    <div className="cart tw-flex tw-flex-col tw-w-full tw-h-full tw-text-2xl tw-bg-slate-100 tw-overflow-hidden">
      <div className="tw-bg-white tw-p-4 tw-border-b tw-border-slate-300 tw-shadow">
        <h1 className="tw-text-center">
          购物车
          {countDown < 11 && (
            <span className="tw-text-xl tw-ml-2">{`(${countDown}秒后返回)`}</span>
          )}
        </h1>
      </div>
      <div className="tw-w-full tw-overflow-y-scroll tw-p-4 tw-flex-1">
        {cartGoods.map((c, index) => (
          <div className="tw-bg-white tw-flex tw-mt-1" key={c.goods._id}>
            <Image src={c.goods.mainImg} width="128" height="128" fit="fill" />
            <div className="tw-flex tw-flex-col tw-px-4 tw-py-2 tw-justify-between tw-flex-1">
              <div>{c.goods.name}</div>
              <div className="tw-flex">
                货道：
                <div className="tw-bg-emerald-500 tw-mr-1 tw-text-2xl tw-px-2 tw-rounded tw-text-white tw-font-bold">
                  {c.goods.track}
                </div>
              </div>
              <div className="tw-flex tw-justify-between">
                <div className="tw-flex">
                  <Price price={c.goods.price / 100} />
                  {c.goods.originalPrice && (
                    <Price
                      price={c.goods.originalPrice / 100}
                      className="tw-ml-4"
                      line
                    />
                  )}
                </div>
                <InputNumber
                  value={c.count}
                  min={0}
                  onChange={(value) => updateCount(value, index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="tw-w-full tw-bg-white tw-p-4 tw-flex tw-border-t tw-border-slate-300 tw-shadow tw-justify-between tw-items-center">
        <Button size="large" onClick={clearCart}>
          清空
        </Button>
        <div>
          共计：
          <Price price={getTotalPrice(cartGoods) / 100} className="tw-mr-4" />
          <Button type="primary" size="large" onClick={toBuy}>
            结算
          </Button>
        </div>
      </div>
    </div>
  );
}
