import React from 'react';
import { useStyle } from '../../classify';
import defaultClasses from './allCategoriesPage.module.css';

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
                { title: "1/4 Zip", link: "/shop/fleece-sweatshirts/1-4-zip.html",},
                { title: "1/2 Zip", link: "/shop/fleece-sweatshirts/1-2-zip.html",},
                { title: "Sweetpants", link: "/shop/fleece-sweatshirts/sweetpants.html",},
                { title: "Jogger", link: "/shop/fleece-sweatshirts/jogger.html",},
                { title: "Shorts", link: "/shop/fleece-sweatshirts/shorts.html",},
                { title: "Women's", link: "/shop/fleece-sweatshirts/women-s.html",},
                { title: "Youth", link: "/shop/fleece-sweatshirts/youth.html",},
                { title: "Toddler", link: "/shop/fleece-sweatshirts/toddler.html",},
                { title: "Blend", link: "/shop/fleece-sweatshirts/blend.html",},
                { title: "Performance", link: "/shop/fleece-sweatshirts/performance.html",},
            ],
      },
      {
        title: "Flannel",
        link: "/shop/flannel.html",
            subMenu: [
                { title: "Pants", link: "/shop/flannel/pants.html",},
                { title: "Jogger", link: "/shop/flannel/jogger.html",},
                { title: "Shorts", link: "/shop/flannel/shorts.html",},
                { title: "Woven Shirts", link: "/shop/flannel/woven-shirts.html",},
                { title: "Women's", link: "/shop/flannel/women-s.html",},
                { title: "Youth", link: "/shop/flannel/youth.html",},
                { title: "Sublimation", link: "/shop/flannel/sublimation.html",},
            ],
      },
    ],
  },
 
];
 
const AllCategoriesPage = (props) => {
    const classes = useStyle(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <h1>All Categories</h1>
            {allCateogiesData.map((category, index) => (
                <div key={index} className={classes.allCategoriesBlock}>
                    <h2>{category.title}</h2>
                    {category.subMenu && (
                        <ul className={classes.list}>
                            {category.subMenu.map((subCategory, subIndex) => (
                                <li key={subIndex}>
                                    <a href={subCategory.link}>{subCategory.title}</a>
                                    {subCategory.subMenu && (
                                        <ul>
                                            {subCategory.subMenu.map((subSubCategory, subSubIndex) => (
                                                <li key={subSubIndex}>
                                                    <a href={subSubCategory.link}>{subSubCategory.title}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AllCategoriesPage;