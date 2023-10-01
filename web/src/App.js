import { useEffect, useState } from "react";
import {
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
import { Service, Jdl } from "@nutui/icons-react";

import About from "./About";
import Settings from "./Settings";
import Login from "./Login";

function App() {
  const [dialogContent, setDialogContent] = useState(null);
  const [banners, setBanners] = useState([]);
  const [goods, setGoods] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST_NAME}/api/v1/vending/banner`, {
      headers: { "X-API-Key": process.env.REACT_APP_API_KEY },
    })
      .then((res) => res.json())
      .then((data) => setBanners(data.payload));

    fetch(`${process.env.REACT_APP_HOST_NAME}/api/v1/vending/goods`, {
      headers: { "X-API-Key": process.env.REACT_APP_API_KEY },
    })
      .then((res) => res.json())
      .then((data) => setGoods(data.payload));
  }, []);

  function onClickAbout() {
    setDialogContent("联系客服");
  }

  function getDialogContent() {
    switch (dialogContent) {
      case "联系客服":
        return <About setDialogContent={setDialogContent} />;
      case "系统设置":
        return <Settings setDialogContent={setDialogContent} />;
      case "管理员登录":
        return <Login setDialogContent={setDialogContent} />;
      default:
        return null;
    }
  }

  return (
    <div className="App tw-pt-4">
      <Row gutter="16" className="tw-px-4">
        <Col span="18">
          <Swiper
            height={360}
            autoPlay={3000}
            indicator
            loop
            className="tw-rounded-lg tw-shadow"
          >
            {banners.map((banner) => (
              <Swiper.Item key={banner._id}>
                <Image src={banner.image} fit="cover" />
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
            <Button className="main-btn code" type="success" icon={<Jdl />}>
              取件码取货
            </Button>
          </div>
        </Col>
      </Row>
      <Grid columns={4} gap="14">
        {goods.map((g) => (
          <Grid.Item key={g._id}>
            <div>
              <Image src={g.mainImg} width="250" height="250" fit="cover" />

              <p className="tw-text-xl tw-mt-2 tw-mx-2">{g.name}</p>
              <div className="tw-flex tw-items-center tw-gap-2  tw-m-2">
                <div className="tw-bg-emerald-500 tw-mr-1 tw-text-2xl tw-px-2 tw-rounded tw-text-white tw-font-bold">{g.track}</div>
                <Price price={g.price / 100}/>
                {g.originalPrice && (
                  <Price price={g.originalPrice / 100} className="tw-mt-2" line />
                )}
              </div>
            </div>
          </Grid.Item>
        ))}
      </Grid>

      <Popup
        visible={dialogContent}
        style={{ height: "60%", width: "60%" }}
        title={dialogContent}
        lockScroll={true}
        closeable
        round
        onClose={() => setDialogContent(null)}
      >
        {getDialogContent()}
      </Popup>
    </div>
  );
}

export default App;
