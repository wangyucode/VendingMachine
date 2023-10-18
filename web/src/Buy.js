import { Button, Price } from "@nutui/nutui-react";
import { Cart } from "@nutui/icons-react";

import { getCartGoodsCount, getTotalPrice } from "./utils";

export default function Buy({ setDialogContent, setCartGoods, cartGoods }) {
  function cancel() {
    setDialogContent("购物车");
  }

  return (
    <div className="cart tw-flex tw-flex-col tw-w-full tw-h-full tw-text-2xl tw-bg-slate-100 tw-overflow-hidden">
      <div className="tw-bg-white tw-p-4 tw-border-b tw-border-slate-300 tw-shadow">
        <h1 className="tw-text-center">结算{countDown < 11 && <span className="tw-text-xl tw-ml-2" >{`(${countDown}秒后返回)`}</span>}</h1>
      </div>
      <div className="tw-w-full tw-overflow-y-scroll tw-p-4 tw-flex-1">
        <div className="tw-w-full tw-text-center tw-text-xl">
          {cartGoods[0].goods.name} 等 {getCartGoodsCount(cartGoods)} 件商品
        </div>
        <div className="tw-w-full tw-text-center tw-text-xl tw-mt-4">
          共计：
          <Price price={getTotalPrice(cartGoods) / 100} className="tw-mr-4" />
        </div>
      </div>

      <div className="tw-w-full tw-bg-white tw-p-4 tw-flex tw-border-t tw-border-slate-300 tw-shadow">
        <Button size="large" onClick={cancel} icon={<Cart width={18} />}>
          返回购物车
        </Button>
      </div>
    </div>
  );
}
