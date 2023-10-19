import { useEffect, useRef } from "react";
import { Button, Price } from "@nutui/nutui-react";
import { Cart } from "@nutui/icons-react";
import UQRCode from "uqrcodejs";

import { getCartGoodsCount, getTotalPrice, postLog } from "./utils";
import wxPayLogo from "./wxpay.png";

let ordering = false;
let checkIntervalId = 0;
let orderId = null;

export default function Buy({
  setDialogContent,
  setCartGoods,
  cartGoods,
  countDown,
  setSendingGoods
}) {
  const description = cartGoods.length > 0 ? `${cartGoods[0].goods.name} 等 ${getCartGoodsCount(
    cartGoods
  )} 件商品`: '';
  const total = getTotalPrice(cartGoods);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (cartGoods.length > 0 && !ordering) {
      ordering = true;
      const goodsDetail = cartGoods.map((cg) => ({
        count: cg.count,
        id: cg.goods._id,
        name: cg.goods.name,
        type: cg.goods.type,
        price:  cg.goods.price,
        track: cg.goods.track
      }));
      const params = { goodsDetail, total, description };
      fetch(`${process.env.REACT_APP_HOST_NAME}/api/v1/vending/order`, {
        headers: {
          "X-API-Key": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.payload.code_url) {
            drawCanvas(data.payload.code_url);
            orderId = data.payload.out_trade_no;
            checkIntervalId = setInterval(checkOrder, 2000);
          } else {
            console.error(data);
            cancel();
            postLog(JSON.stringify(data));
          }
        });
    }
  }, []);

  async function checkOrder() {
    if (orderId === null) {
      clearInterval(checkIntervalId);
      return;
    }
    const res = await fetch(
      `${process.env.REACT_APP_HOST_NAME}/api/v1/vending/order?id=${orderId}`,
      { headers: { "X-API-Key": process.env.REACT_APP_API_KEY } }
    );
    const data = await res.json();
    console.log(data);
    if (
      data &&
      data.success &&
      data.payload &&
      data.payload.trade_state === "SUCCESS"
    ) {
      setSendingGoods(data.payload.goodsDetail);
      clearInterval(checkIntervalId);
      setCartGoods([]);
      ordering = false;
      orderId = null;
      setDialogContent("出货");
    }
  }

  function drawCanvas(url) {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const qr = new UQRCode();
      qr.data = url;
      qr.size = 200;
      qr.make();
      qr.canvasContext = ctx;
      qr.drawCanvas();
    }
  }

  function cancel() {
    ordering = false;
    orderId = null;
    setDialogContent("购物车");
  }

  return (
    <div className="cart tw-flex tw-flex-col tw-w-full tw-h-full tw-text-2xl tw-bg-slate-100 tw-overflow-hidden">
      <div className="tw-bg-white tw-p-4 tw-border-b tw-border-slate-300 tw-shadow">
        <h1 className="tw-text-center">
          结算
          {countDown < 11 && (
            <span className="tw-text-xl tw-ml-2">{`(${countDown}秒后返回)`}</span>
          )}
        </h1>
      </div>
      <div className="tw-w-full tw-overflow-y-scroll tw-p-4 tw-flex-1 tw-items-center tw-flex tw-flex-col">
        <div className="tw-text-xl">{description}</div>
        <div className="tw-text-xl tw-mt-4">
          共计：
          <Price price={total / 100} className="tw-mr-4" />
        </div>
        <img src={wxPayLogo} width={192} className="tw-mt-12" />
        <canvas ref={canvasRef} width="200" height="200" className="tw-mt-4" />
      </div>
    </div>
  );
}
