import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '../../classify';
import defaultClasses from './submenuColumn.module.css';
import PropTypes from 'prop-types';

/**
 * The SubmenuColumn component displays columns with categories in submenu
 *
 * @param {MegaMenuCategory} props.category
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const SubmenuColumn = props => {
    const {
        category,
        categoryUrlSuffix,
        onNavigate,
        handleCloseSubMenu,
        parentIndex,
        isActive,
        setActiveIndex
    } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const categoryUrl = resourceUrl(
        `/${category.url_path}${categoryUrlSuffix || ''}`
    );
    let children = null;

    const childrenClasses = isActive?classes.hoverSubMenuActive:classes.hoverSubMenu

    if (category.children.length) {
        const childrenItems = category.children.map((subCategory, index) => {
            const { url_path, isActive, name } = subCategory;
            const categoryUrl = resourceUrl(
                `/${url_path}${categoryUrlSuffix || ''}`
            );

            // setting keyboardProps if it is last child of that category
            const keyboardProps =
                index === category.children.length - 1
                    ? props.keyboardProps
                    : {};

            return (
                <li key={index} className={classes.submenuChildItem}>
                    <Link
                        {...keyboardProps}
                        className={isActive ? classes.linkActive : classes.link}
                        data-cy="MegaMenu-SubmenuColumn-link"
                        to={categoryUrl}
                        onClick={() => {
                            handleCloseSubMenu();
                            onNavigate();
                        }}
                    >
                        {name}
                    </Link>
                </li>
            );
        });

        children = (
            <div className={childrenClasses}>
                <h3>{category.name}</h3>
                <ul className={classes.menFilter}>
                    <li><a href="#">New</a></li>
                    <li><a href="#">Sale</a></li>
                    <li><a href="#">Value Basics</a></li>
                    <li><a href="#">Discontinued</a></li>
                </ul>
                <ul className={classes.submenuChild}>{childrenItems}</ul>
            </div>
        );
    }

    // setting keyboardProps if category does not have any sub-category
    const keyboardProps = category.children.length ? {} : props.keyboardProps;

    const subMenuColumnClass = isActive
        ? [classes.submenuColumn, classes.active].join(' ')
        : classes.submenuColumn;

    return (
        <div
            className={subMenuColumnClass}
            onMouseEnter={() => setActiveIndex(parentIndex)}
            onMouseLeave={() => setActiveIndex(0)}
        >
            <Link
                {...keyboardProps}
                className={classes.link}
                data-cy="MegaMenu-SubmenuColumn-link"
                to={categoryUrl}
                onClick={() => {
                    handleCloseSubMenu();
                    onNavigate();
                }}
            >
                <span className={classes.heading}>{category.name}</span>
            </Link>
            {children}
        </div>
    );
};

export default SubmenuColumn;

SubmenuColumn.propTypes = {
    category: PropTypes.shape({
        children: PropTypes.array,
        uid: PropTypes.string.isRequired,
        include_in_menu: PropTypes.number,
        isActive: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.array.isRequired,
        position: PropTypes.number.isRequired,
        url_path: PropTypes.string.isRequired
    }).isRequired,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleCloseSubMenu: PropTypes.func.isRequired
};
