import { useState } from "react";
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
  const products = [
    {
      mainImg: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    },
    {
      mainImg: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    },
    {
      mainImg: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    },
    {
      mainImg: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    },
    {
      mainImg: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
    },
  ];

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
            <Swiper.Item>
              <Image
                src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
                fit="cover"
              />
            </Swiper.Item>
            <Swiper.Item>
              <Image
                src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
                fit="cover"
              />
            </Swiper.Item>
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
        {products.map((product, index) => (
          <Grid.Item key={index}>
            <div>
              <Image
                src={product.mainImg}
                width="250"
                height="250"
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
