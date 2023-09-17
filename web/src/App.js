import { useState } from "react";
import {
  NoticeBar,
  Popup,
} from "@nutui/nutui-react";
import "./App.css";

import About from "./About";
import Settings from "./Settings";



function App() {
  
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  let lastClickLogin = 0;
  let loginClickCount = 0;



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
    <div className="App">
      <NoticeBar
        content="联系客服点我，柜子左边有购物袋，持续上新促销中！"
        scrollable
        onClick={onClickAbout}
      ></NoticeBar>
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
