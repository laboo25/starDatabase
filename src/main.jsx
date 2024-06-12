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

// Function to check if screen width is less than or equal to 375px
const isMobileScreen = () => window.innerWidth <= 375;

// Fancybox options
const fancyboxOptions = {
  Carousel: {
    transition: "slide",
  },
  Toolbar: {
    display: {
      left: ["infobar"],
      middle: isMobileScreen()
        ? [] // Empty array for middle buttons if on mobile screen
        : ["zoomIn", "zoomOut", "rotateCW", "flipX", "flipY"],
      right: isMobileScreen()
        ? ["thumbs", "download", "close"] // Show only these on mobile
        : ["slideshow", "fullscreen", "thumbs", "download", "close"],
    },
  },
};

// Bind Fancybox with options
Fancybox.bind('[data-fancybox="gallery"]', fancyboxOptions);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/star/:_id",
    element: <StarDeltails />,
  },
  {
    path: "/query",
    element: <Search />,
  },
  {
    path: "/albums",
    element: <GetAlbum />,
  },
  {
    path: "/images",
    element: <Images />,
  },
  {
    path: "/create",
    element: <Create />,
    children: [
      {
        path: "/create",
        element: <CreateStar />,
      },
      {
        path: "/create/create-bio",
        element: <CreateStarBio />,
      },
      {
        path: "/create/create-images",
        element: <CreateImages />,
      },
      {
        path: "/create/create-album",
        element: <CreateAlbums />,
      },
      {
        path: "/create/update-all",
        element: <UpdateAll />,
      },
      {
        path: "/create/update-star",
        element: <StarUpdate />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
