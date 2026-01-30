const extractResizableID = (item) => {
	const isRezible = item?.includes("images.arcpublishing.com");
	return isRezible ? item?.split("/").pop().split(".").shift() : item;
};

export default extractResizableID;
