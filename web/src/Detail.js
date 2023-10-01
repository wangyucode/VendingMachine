import { Divider, Image, Price, InputNumber, Button, Tabbar } from "@nutui/nutui-react";
import { Cart} from '@nutui/icons-react';

export default function Detail({ goods }) {
  return (
    <div className="detail tw-flex tw-flex-col tw-w-full tw-h-full tw-text-2xl tw-bg-slate-100 tw-overflow-hidden">
      <div className="tw-bg-white tw-p-4 tw-border-b tw-border-slate-300 tw-shadow">
        <h1 className="tw-text-center">商品详情</h1>
      </div>
      <div className="tw-w-full tw-overflow-y-scroll tw-p-4">
        <Image src={goods.mainImg} width="100%" />
        <div className="tw-mt-2 tw-w-full">
          <Price price={goods.price / 100} />
          {goods.originalPrice && (
            <Price price={goods.originalPrice / 100} className="tw-ml-4" line />
          )}
        </div>
        <div className="tw-text-left tw-w-full">{goods.name}</div>
        <div className="tw-w-full tw-flex tw-mt-2">
          货道：
          <div className="tw-bg-emerald-500 tw-mr-1 tw-text-2xl tw-px-2 tw-rounded tw-text-white tw-font-bold">
            {goods.track}
          </div>
        </div>
        <Divider />
        <div className="tw-w-full tw-flex">
          数量：
          <InputNumber defaultValue={1} className="tw-ml-4" />
        </div>
        <Divider />
        <div className="tw-w-full tw-mb-2">更多图片：</div>
        {goods.images.map((image, index) => (
          <Image src={image} width="100%" key={index} />
        ))}
      </div>

      <div className="tw-w-full tw-bg-white tw-p-4 tw-flex tw-border-t tw-border-slate-300 tw-shadow tw-justify-between">
        <Button size="large" className="cart" icon={<Cart width={18}/>}>购物车</Button>
        <div className="tw-flex">
          <Button type="warning" size="large">加入购物车</Button>
          <Button type="primary" size="large" style={{ marginLeft: "8px" }}>
            立即购买
          </Button>
        </div>
      </div>
    </div>
  );
}
