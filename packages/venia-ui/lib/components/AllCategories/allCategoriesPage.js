import React from 'react';

const allCateogiesData = [
  {
    title: "Shop",
    subMenu: [
      {
        title: "Brands",
        link: "/shop/brands.html",
            subMenu: [
                {
                    title: "Boxercraft",
                    link: "#",
                },
                {
                    title: "Recover",
                    link: "#",
                },
                {
                    title: "Headswearts",
                    link: "#",
                },
            ],
      },
      {
        title: "Sustainable",
        subMenu: [
          {
            title: "ChipsT-Shirts",
            link: "/shop/sustainabe/t-shirts.html",
          },
          {
            title: "Polo Shirts",
            link: "/shop/sustainabe/polo-shirts.html",
          },
                    {
            title: "Woven Shirts",
            link: "/shop/sustainabe/woven-shirts.html",
          },
                    {
            title: "Outerwear",
            link: "/shop/sustainabe/outerwear.html",
          },
                    {
            title: "Activewear",
            link: "/shop/sustainabe/activewear.html",
          },
                    {
            title: "Caps",
            link: "/shop/sustainabe/caps.html",
          },
                    {
            title: "Women's",
            link: "/shop/sustainabe/women-s.html",
          },
                    {
            title: "Youth",
            link: "/shop/sustainabe/youth.html",
          },
                    {
            title: "Toddler",
            link: "/shop/sustainabe/toddler.html",
          },
                    {
            title: "Organic",
            link: "/shop/sustainabe/organic.html",
          },
                    {
            title: "Tanks",
            link: "/shop/sustainabe/tanks.html",
          },
          {
            title: "Socks",
            link: "/shop/sustainabe/socks.html",
          },
          {
            title: "Totes",
            link: "/shop/sustainabe/totes.html",
          },
        ],
      },
      {
        title: "T-Shirts",
        link: "/shop/t-shirts.html",
            subMenu: [
                { title: "Short Sleeve", link: "/shop/t-shirts/short-sleeve.html",},
                { title: "Long Sleeve", link: "/shop/t-shirts/long-sleeve.html",},
                { title: "Women's", link: "/shop/t-shirts/women-s.html",},
                { title: "Youth", link: "/shop/t-shirts/youth.html",},
                { title: "Toddler", link: "/shop/t-shirts/toddler.html",},
                { title: "Cotton", link: "/shop/t-shirts/cotton.html",},
                { title: "Blend", link: "/shop/t-shirts/blend.html",},
                { title: "Performance", link: "/shop/t-shirts/performance.html",},
                { title: "Organic", link: "/shop/t-shirts/organic.html",},
                { title: "V-Neck", link: "/shop/t-shirts/v-neck.html",},
                { title: "Tanks", link: "/shop/t-shirts/tanks.html",},
                { title: "Henley", link: "/shop/t-shirts/henley.html",},
                { title: "Hoodie", link: "/shop/t-shirts/hoodie.html",},
                { title: "Pickleball", link: "/shop/t-shirts/pickleball.html",},
                { title: "Dress", link: "/shop/t-shirts/dress.html",},
                { title: "Sublimation", link: "/shop/t-shirts/sublimation.html",},
            ],
      },
     {
        title: "Fleece/Sweatshirts",
        link: "/shop/fleece-sweatshirts.html",
            subMenu: [
                { title: "Crewneck", link: "/shop/fleece-sweatshirts/crewneck.html",},
                { title: "Hoodie", link: "/shop/fleece-sweatshirts/hoodie.html",},
                { title: "Full Zip", link: "/shop/fleece-sweatshirts/full-zip.html",},
                { title: "", link: "/shop/fleece-sweatshirts/1-4-zip.html",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
            ],
      },
      {
        title: "T-Shirts",
        link: "/shop/t-shirts.html",
            subMenu: [
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
                { title: "", link: "",},
            ],
      },
    ],
  },
  {
    title: "About Us",
    link: "/about",
  },
];
const AllCategoriesPage = () => {
    return (
        <div>
            <h1>All Categories</h1>
        </div>
    );
};

export default AllCategoriesPage;