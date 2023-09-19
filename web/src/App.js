import { useState } from "react";
import {
  NoticeBar,
  Popup,
  Swiper,
  Col,
  Row,
  Button,
  Grid,
  Image,
  Price,
  Tag,
} from "@nutui/nutui-react";
import { SignalSlashIcon, SignalIcon } from "@heroicons/react/24/solid";

import About from "./About";
import Settings from "./Settings";
import "./App.css";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const products = [
    {
      mainImg:
        "//img10.360buyimg.com/ling/jfs/t1/181258/24/10385/53029/60d04978Ef21f2d42/92baeb21f907cd24.jpg",
    },
    {
      mainImg:
        "//img10.360buyimg.com/ling/jfs/t1/181258/24/10385/53029/60d04978Ef21f2d42/92baeb21f907cd24.jpg",
    },
    {
      mainImg:
        "//img10.360buyimg.com/ling/jfs/t1/181258/24/10385/53029/60d04978Ef21f2d42/92baeb21f907cd24.jpg",
    },
    {
      mainImg:
        "//img10.360buyimg.com/ling/jfs/t1/181258/24/10385/53029/60d04978Ef21f2d42/92baeb21f907cd24.jpg",
    },
    {
      mainImg:
        "//img10.360buyimg.com/ling/jfs/t1/181258/24/10385/53029/60d04978Ef21f2d42/92baeb21f907cd24.jpg",
    },
  ];

  function onClickAbout() {
    // if (lastClickLogin === 0) {
    //   lastClickLogin = new Date().getTime();
    //   return;
    // }

    // if (loginClickCount > 5) {
    //   loginClickCount = 0;
    //   lastClickLogin = 0;
    //   setShowSettings(true);
    //   return;
    // }

    // if (new Date().getTime() - lastClickLogin < 1000) {
    //   loginClickCount++;
    //   return;
    // }

    // // todo show service
    // loginClickCount = 0;
    // lastClickLogin = 0;
    setShowSettings(true);
  }

  return (
    <div className="App tw-bg-slate-50">
      <NoticeBar
        content="联系客服点我，柜子左边有购物袋，持续上新促销中！"
        scrollable
        onClick={onClickAbout}
        leftIcon={navigator.onLine ? <SignalIcon /> : <SignalSlashIcon />}
      ></NoticeBar>
      <Row gutter="10" className="tw-p-4">
        <Col span="16">
          <Swiper height={240} autoPlay={3000} indicator loop>
            <Swiper.Item>
              <img
                src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
                alt=""
              />
            </Swiper.Item>
            <Swiper.Item>
              <img
                src="https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg"
                alt=""
              />
            </Swiper.Item>
          </Swiper>
        </Col>
        <Col span="8" gutter="10">
          <div className="tw-flex tw-flex-col tw-gap-y-4">
            <Button className="main-btn choose" type="info">
              选择编号
            </Button>
            <Button className="main-btn code" type="success">
              取件码取货
            </Button>
          </div>
        </Col>
      </Row>
      <div className="tw-px-1.5">
        <Grid columns={4} gap="8">
          {products.map((product) => (
            <Grid.Item>
              <div>
                <Image
                  src={product.mainImg}
                  width="160"
                  height="160"
                  fit="cover"
                />

                <p className="tw-text-xl tw-mt-2 tw-mx-2">我是商品名</p>
                <div className="tw-flex tw-items-center tw-gap-2  tw-m-2">
                  <Tag type="success tw-mr-1 tw-text-lg">12</Tag>
                  <Price price={128.01} />
                </div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </div>

      <Popup
        visible={showAbout}
        style={{ height: "50%" }}
        position="bottom"
        title="联系客服"
        closeable
        onClose={() => setShowAbout(false)}
      >
        <About></About>
      </Popup>

      <Popup
        visible={showSettings}
        style={{ height: "50%" }}
        position="bottom"
        title="系统设置"
        closeable
        onClose={() => setShowSettings(false)}
      >
        <Settings></Settings>
      </Popup>
    </div>
  );
}

export default App;
