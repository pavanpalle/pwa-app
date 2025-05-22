import { useAllCategoriesPage } from '@magento/peregrine/lib/talons/AllCategoriesPage/useAllCategoriesPage';
import { useStyle } from '../../classify';
import defaultClasses from './allCategoriesPage.module.css';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Breadcrumbs from '../../components/Breadcrumbs';

const AllCategoriesPage = props => {
    const { megaMenuData } = useAllCategoriesPage();
    const classes = useStyle(defaultClasses, props.classes);

    const items = megaMenuData.children
        ? megaMenuData.children.map(category => {
              return (
                  
                      <li key={category.uid}>
                          <a href={category.url_path}>{category.name}</a>
                          {category.children && (
                              <ul>
                                  {category.children.map(subSubCategory => (
                                      <li key={subSubCategory.uid}>
                                          <a href={subSubCategory.url_path}>
                                              {subSubCategory.name}
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </li>
                 
              );
          })
        : null;

    return (
        <div className={classes.root}>
        <Breadcrumbs categoryId={'NTg='} />
                    {/* <h1>
                <FormattedMessage
                    id={'AllCategoriesPage-heading'}
                    defaultMessage={'All Categories'}
                />
            </h1> */}

            <div className={classes.allCategoriesBlock}>
                <h2>{megaMenuData.name}</h2>
                <ul className={classes.list}>
                {items}
                </ul>
            </div>
        </div>
    );
};

export default AllCategoriesPage;
