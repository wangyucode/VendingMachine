import { useEffect, useRef, useState } from "react";
import {
  Popup,
  Swiper,
  Col,
  Row,
  Button,
  Grid,
  Image,
  Price,
  Badge,
  Drag,
  Notify,
} from "@nutui/nutui-react";
import { Service, Jdl, Cart } from "@nutui/icons-react";

import About from "./About";
import Settings from "./Settings";
import Login from "./Login";
import Detail from "./Detail";
import GoodsCart from "./GoodsCart";
import Buy from "./Buy";
import Send from "./Send";
import { getCartGoodsCount, postLog } from "./utils";
import Code from "./Code";
import { sendMsg } from "./android";

let currentGoods = null;
let iterationTimeoutId = 0;
let returnCountDownId = 0;
let currentDialogTitle = null;
let heartbeatIntervalId = 0;
export const orderStore = {
  ordering: false,
  checkIntervalId: 0,
  orderId: null,
};
let interacting = false;

function App() {
  const appRef = useRef(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [banners, setBanners] = useState([]);
  const [goods, setGoods] = useState([]);
  const [cartGoods, setCartGoods] = useState([]);
  const [returnCountDown, setReturnCountDown] = useState(60);
  const [sendingGoods, setSendingGoods] = useState([]);
  const [closeable, setCloseable] = useState(true);

  useEffect(() => {
    fetchBanner();
    fetchGoods();
    if (!heartbeatIntervalId)
      heartbeatIntervalId = setInterval(heartbeat, 60 * 1000);
  }, []);

  async function heartbeat() {
    const res = await fetch(
      `${import.meta.env.VITE_APP_HOST_NAME}/api/v1/vending/heartbeat`,
      {
        headers: { "X-API-Key": import.meta.env.VITE_APP_API_KEY },
      }
    );
    const data = await res.json();
    if (data && data.success) {
      if (data.payload.updateGoods) fetchGoods();
      if (data.payload.updateBanner) fetchBanner();
      if (data.payload.updateWeb) {
        const msg = JSON.stringify({ type: 3 });
        sendMsg(msg, console.log);
      }
    }
  }

  async function fetchBanner() {
    const res = await fetch(
      `${import.meta.env.VITE_APP_HOST_NAME}/api/v1/vending/banner`,
      {
        headers: { "X-API-Key": import.meta.env.VITE_APP_API_KEY },
      }
    );
    const data = await res.json();
    if (data && data.success) {
      setBanners(data.payload);
    }
  }

  async function fetchGoods() {
    const res = await fetch(
      `${import.meta.env.VITE_APP_HOST_NAME}/api/v1/vending/goods`,
      {
        headers: { "X-API-Key": import.meta.env.VITE_APP_API_KEY },
      }
    );
    const data = await res.json();
    if (data && data.success) {
      setGoods(data.payload.filter((g) => g.stock > 0));
    }
  }

  function onClickAbout() {
    changeDialogContent("联系客服");
  }

  function openDetail(goods) {
    currentGoods = goods;
    changeDialogContent("商品详情");
  }

  function openCart() {
    changeDialogContent("购物车");
  }

  function codeGetGoods() {
    changeDialogContent("提货码");
  }

  function changeDialogContent(title) {
    setDialogContent(title);
    currentDialogTitle = title;
    if (currentDialogTitle === "出货") {
      clearInterval(returnCountDownId);
      setReturnCountDown(60);
      setCloseable(false);
    } else {
      setUpDialogTimeout();
      setCloseable(true);
    }
  }

  function setUpDialogTimeout(count = 180) {
    clearInterval(returnCountDownId);
    clearInterval(orderStore.checkIntervalId);
    orderStore.ordering = false;
    orderStore.orderId = null;
    setReturnCountDown(60);
    if (currentDialogTitle) {
      returnCountDownId = setInterval(() => {
        if (count === 0) {
          clearInterval(returnCountDownId);
          clearInterval(orderStore.checkIntervalId);
          orderStore.ordering = false;
          orderStore.orderId = null;
          setReturnCountDown(60);
          setDialogContent(null);
          appRef.current.scrollTop = 0;
        } else if (count < 11) {
          setReturnCountDown(count);
        }
        count--;
      }, 1000);
    }
  }

  function getDialogContent() {
    switch (dialogContent) {
      case "联系客服":
        return (
          <About
            setDialogContent={changeDialogContent}
            countDown={returnCountDown}
          />
        );
      case "系统设置":
        return (
          <Settings
            setDialogContent={changeDialogContent}
            countDown={returnCountDown}
          />
        );
      case "管理员登录":
        return (
          <Login
            setDialogContent={changeDialogContent}
            countDown={returnCountDown}
          />
        );
      case "商品详情":
        return (
          <Detail
            setDialogContent={changeDialogContent}
            goods={currentGoods}
            setCartGoods={setCartGoods}
            cartGoods={cartGoods}
            countDown={returnCountDown}
          />
        );
      case "购物车":
        return (
          <GoodsCart
            setDialogContent={changeDialogContent}
            setCartGoods={setCartGoods}
            cartGoods={cartGoods}
            clearCart={clearCart}
            countDown={returnCountDown}
          />
        );

      case "结算":
        return (
          <Buy
            setDialogContent={changeDialogContent}
            setCartGoods={setCartGoods}
            cartGoods={cartGoods}
            countDown={returnCountDown}
            setSendingGoods={setSendingGoods}
          />
        );
      case "出货":
        return (
          <Send
            countDown={returnCountDown}
            sendingGoods={sendingGoods}
            setSendingGoods={setSendingGoods}
            setUpDialogTimeout={setUpDialogTimeout}
            fetchGoods={fetchGoods}
            setCloseable={setCloseable}
          />
        );
      case "提货码":
        return (
          <Code
            setDialogContent={changeDialogContent}
            countDown={returnCountDown}
            setSendingGoods={setSendingGoods}
            setUpDialogTimeout={setUpDialogTimeout}
          />
        );
      default:
        return null;
    }
  }

  function clearCart() {
    setCartGoods([]);
    setDialogContent(null);
  }

  function onInteraction() {
    clearInterval(iterationTimeoutId);
    setUpDialogTimeout();
    Notify.hide();
    if (cartGoods.length > 0) {
      let count = 600;
      iterationTimeoutId = setInterval(function () {
        if (count === 0) {
          clearInterval(iterationTimeoutId);
          clearCart();
          return;
        } else if (count < 11) {
          Notify.text(`无操作${count}秒后清空购物车`, { duration: 1000 });
        }
        count--;
      }, 1000);
    }
    if(!interacting) {
      interacting = true;
      postLog("Interacting", "ERROR");
      setTimeout(() => {
        interacting = false;
      }, 10*60*1000);
    }
  }

  function bannerClick(banner) {
    if (banner.goodsId) {
      const g = goods.find((v) => v._id === banner.goodsId);
      if (g) {
        currentGoods = g;
        changeDialogContent("商品详情");
      }
    }
  }

  return (
    <div
      className="app tw-pt-4 tw-overflow-y-scroll"
      onTouchStart={onInteraction}
      ref={appRef}
    >
      <Row gutter="16" className="tw-px-4">
        <Col span="18">
          <Swiper
            height={360}
            width={778}
            autoPlay={3000}
            preventDefault={false}
            indicator
            loop
            className="tw-rounded-lg tw-shadow"
          >
            {banners.map((banner) => (
              <Swiper.Item key={banner._id}>
                <Image
                  src={banner.image}
                  fit="fill"
                  width="778"
                  height="360"
                  onClick={() => bannerClick(banner)}
                />
              </Swiper.Item>
            ))}
          </Swiper>
        </Col>
        <Col span="6" gutter="10">
          <div className="tw-flex tw-flex-col">
            <Button
              className="main-btn choose"
              type="info"
              onClick={onClickAbout}
              icon={<Service />}
            >
              联系客服
            </Button>
            <Button
              className="main-btn code"
              type="success"
              icon={<Jdl />}
              onClick={codeGetGoods}
            >
              取件码取货
            </Button>
          </div>
        </Col>
      </Row>
      <Grid columns={4} gap="14">
        {goods.map((g) => (
          <Grid.Item key={g._id} onClick={() => openDetail(g)}>
            <div>
              <Image src={g.mainImg} width="250" height="250" fit="cover" />

              <p className="tw-text-xl tw-mt-2 tw-mx-2 tw-font-bold">
                {g.name}
              </p>
              <div className="tw-flex tw-items-center tw-gap-2  tw-m-2">
                <div className="tw-bg-emerald-500 tw-mr-1 tw-text-2xl tw-px-2 tw-rounded tw-text-white tw-font-bold">
                  {g.track}
                </div>
                <Price price={g.price / 100} />
                {g.originalPrice && (
                  <Price
                    price={g.originalPrice / 100}
                    className="tw-mt-2 tw-ml-4"
                    line
                  />
                )}
              </div>
            </div>
          </Grid.Item>
        ))}
      </Grid>

      <Drag
        className="tw-top-1/2"
        style={{
          visibility:
            dialogContent === null && cartGoods.length > 0
              ? "visible"
              : "hidden",
        }}
        boundary={{ top: 8, left: 0, bottom: 108, right: 8 }}
        attract
      >
        <Badge value={getCartGoodsCount(cartGoods)}>
          <Button
            size="large"
            className="cart-float"
            icon={<Cart width={18} />}
            onClick={openCart}
          />
        </Badge>
      </Drag>

      <Popup
        visible={dialogContent}
        style={{ height: "60%", width: "60%" }}
        title={dialogContent}
        closeable={closeable}
        closeOnOverlayClick={closeable}
        onClose={() => setDialogContent(null)}
        round
        lockScroll
      >
        {getDialogContent()}
      </Popup>
    </div>
  );
}

export default App;
