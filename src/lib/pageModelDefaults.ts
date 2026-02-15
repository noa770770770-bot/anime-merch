import type { PageModel } from "@/types/pageModel";

export const defaultPageModel: PageModel = {
  id: "page-1",
  sections: [
    {
      id: "section-1",
      type: "section",
      layout: { x: 0, y: 0, width: 1200, height: 400 },
      style: { background: "linear-gradient(90deg,#23232b,#18181b)" },
      containers: [
        {
          id: "container-1",
          type: "container",
          layout: { x: 0, y: 0, width: 1200, height: 400 },
          style: {},
          elements: [
            {
              id: "el-1",
              type: "text",
              props: { text: "Welcome to your anime merch site!" },
              layout: { x: 100, y: 100, width: 600, height: 60 },
              style: { font: "Montserrat", color: "#fff", fontSize: 36 },
            },
            {
              id: "el-2",
              type: "text",
              props: { text: "Naruto Headband - $12.99" },
              layout: { x: 100, y: 180, width: 400, height: 40 },
              style: { font: "Montserrat", color: "#ffe066", fontSize: 24 },
            },
            {
              id: "el-3",
              type: "text",
              props: { text: "One Piece Straw Hat - $15.99" },
              layout: { x: 100, y: 230, width: 400, height: 40 },
              style: { font: "Montserrat", color: "#fca311", fontSize: 24 },
            },
            {
              id: "el-4",
              type: "text",
              props: { text: "Attack on Titan Hoodie - $39.99" },
              layout: { x: 100, y: 280, width: 400, height: 40 },
              style: { font: "Montserrat", color: "#e63946", fontSize: 24 },
            },
            {
              id: "el-5",
              type: "text",
              props: { text: "Sailor Moon Mug - $9.99" },
              layout: { x: 100, y: 330, width: 400, height: 40 },
              style: { font: "Montserrat", color: "#a2d2ff", fontSize: 24 },
            },
            {
              id: "el-6",
              type: "text",
              props: { text: "My Hero Academia Keychain - $6.99" },
              layout: { x: 100, y: 380, width: 400, height: 40 },
              style: { font: "Montserrat", color: "#43aa8b", fontSize: 24 },
            },
          ],
        },
      ],
    },
  ],
};
