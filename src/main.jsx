import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import StarDeltails from "./components/starBio/StarDeltails";
import Create from "./components/create/Create";
import CreateStar from "./components/create/CreateStar";
import CreateStarBio from "./components/create/CreateStarBio";
import CreateAlbums from "./components/create/CreateAlbums";
import CreateImages from "./components/create/CreateImages";
import UpdateAll from "./components/create/UpdateAll";
import StarUpdate from "./components/update/StarUpdate";
import Search from "./components/search/Search";
import Images from "./components/images/Images";
import GetAlbum from "./components/album/GetAlbum";
import UpdateAlbum from "./components/create/UpdateAlbum";
import { Provider } from "react-redux";
import store from "./app/store";

Fancybox.bind('[data-fancybox="gallery"]', {
  Carousel: {
        transition: "slide",
      },
  Toolbar: {
    display: {
      left: ["infobar"],
      middle: [
        "zoomIn",
        "zoomOut",
        "rotateCW",
        "flipX",
        "flipY",
      ],
      right: ["slideshow", "fullscreen", "thumbs", "download", "close"],
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/star/:_id",
    element: <StarDeltails/>,
  },
  {
    path: "/query",
    element: <Search/>,
  },
  {
    path: "/albums",
    element: <GetAlbum/>,
  },
  {
    path: "/images",
    element: <Images/>,
  },
  {
    path: "/create",
    element: <Create/>,
    children: [{
      path: "/create",
      element: <CreateStar/>,
    },
    {
      path: '/create/create-bio',
      element: <CreateStarBio/>,
    },
    {
      path: '/create/create-images',
      element: <CreateImages/>,
    },
    {
      path: '/create/create-album',
      element: <CreateAlbums/>,
    },
    {
      path: '/create/update-all',
      element: <UpdateAll/>,
    },
    {
      path: '/create/update-star',
      element: <StarUpdate/>,
    },
    {
      path: '/create/update-album',
      element: <UpdateAlbum/>,
    },
  ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
);