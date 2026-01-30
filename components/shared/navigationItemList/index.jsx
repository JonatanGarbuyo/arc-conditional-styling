import React from "react";
import PropTypes from "prop-types";
import Conditional from "../conditional";
import Link from "../link";

const NavigationItemList = ({ itemList = [], className, ...rest }) => {
	return (
		<ul className={className} {...rest}>
			{itemList?.map((item, index) => {
				const itemName = item?.display_name ?? item?.name ?? "";
				const itemUrl = item?.url ?? item?._id ?? "";
				return itemName ? (
					<li key={`${className}-${itemName}-${itemUrl}-${index}`}>
						<Conditional aria-label={itemName} component={Link} condition={itemUrl} href={itemUrl}>
							<span>{itemName}</span>
						</Conditional>
					</li>
				) : null;
			})}
		</ul>
	);
};

export default NavigationItemList;

NavigationItemList.propTypes = {
	className: PropTypes.string,
	itemList: PropTypes.array,
};
