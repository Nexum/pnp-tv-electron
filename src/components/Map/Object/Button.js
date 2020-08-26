import {Group, Rect, Text} from "react-konva";
import {useEffect, useRef, useState} from "react";

export default function Button({label, color, textColor, onClick, ...props}) {
    const [currentColor, setColor] = useState(color);
    const text = useRef();
    const rect = useRef();

    // Size Button to Text
    useEffect(() => {
        if (text.current) {
            rect.current.width(text.current.width());
        }
    }, [label]);

    // Apply Button Color
    useEffect(() => {
        if (rect.current) {
            rect.current.fill(currentColor);
        }
    }, [currentColor]);

    // Click
    function handleClick(e) {
        if (onClick) {
            e.cancelBubble = true;
            onClick();
        }
    }

    // Hover
    function onHover(e) {
        setColor("#7b7b7b");
    }

    function onOut(e) {
        setColor(color);
    }

    return (
        <Group {...props} width={200} height={31} onClick={handleClick} onMouseOver={onHover} onMouseOut={onOut}>
            <Rect
                ref={rect}
                fill={currentColor}
                width={200}
                height={31}
            />
            <Text
                ref={text}
                text={label}
                padding={10}
                fill={textColor || "#000000"}
            />
        </Group>
    );
}