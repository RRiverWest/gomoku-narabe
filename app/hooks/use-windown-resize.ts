import { useState, useEffect } from "react";

interface WidthAndHeight {
	width: number;
	height: number;
	isVertical: boolean;
}

const useWindowResize = () => {
	const [widthAndHeight, setWidthAndHeight] = useState<WidthAndHeight>({
		width: 0,
		height: 0,
		isVertical: false,
	});

	const handleResize = () => {

		setWidthAndHeight({
			width: window.innerWidth,
			height: window.innerHeight,
			isVertical: window.innerWidth < window.innerHeight ? true : false,
		});
	};

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);


	return widthAndHeight;
};

export default useWindowResize;
