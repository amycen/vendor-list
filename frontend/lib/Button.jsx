import React from "react";
import PropTypes from "prop-types";
import { css } from "aphrodite";
import cx from "classnames";
import customStyleSheet from "./customStyleSheet";
import {
  Color,
  Size,
  Weight,
  sizeMap,
  leadingMap,
  weightMap,
  colorMap,
} from "./typography";

//TODO: clean up props
const propTypes = {
  color: PropTypes.oneOf(Object.values(Color)),
  weight: PropTypes.oneOf(Object.values(Weight)),
  size: PropTypes.oneOf(Object.values(Size)),
  children: PropTypes.node.isRequired,

  className: PropTypes.string,

  regular: PropTypes.bool,
  small: PropTypes.bool,

  secondary: PropTypes.bool,
  disabled: PropTypes.bool,
  muted: PropTypes.bool,
  inherit: PropTypes.bool,
  inverse: PropTypes.bool,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

const defaultProps = {
  color: Color.default,
  weight: Weight.default,
  size: Size.regular,

  className: undefined,

  regular: false,
  small: false,

  secondary: false,
  disabled: false,
  muted: false,
  inherit: false,
  inverse: false,
  error: false,
  success: false,
};

export function getTypographyStyles() {
  const stylesObject = {};

  const sizes = Object.keys(Size);
  const weights = Object.keys(Weight);
  const colors = Object.keys(Color);

  sizes.forEach((size) => {
    stylesObject[`size_${size}`] = {
      fontSize: sizeMap[size],
    };

    stylesObject[`leading_${size}`] = {
      lineHeight: `${leadingMap[size] / sizeMap[size]}em`,
    };

    weights.forEach((weight) => {
      stylesObject[`weight_${size}_${weight}`] = {
        fontWeight: weightMap[weight][size],
      };
    });
  });

  colors.forEach((color) => {
    stylesObject[`color_${color}`] = {
      color: colorMap[color],
    };
  });

  return stylesObject;
}

export function getPropSize(otherProps) {
  const matchedSizes = Object.values(Size).filter((s) => {
    return !!otherProps[s];
  });
  if (matchedSizes.length > 0) {
    return matchedSizes[0];
  }
  return otherProps.size;
}

function getPropColor(otherProps) {
  const matchedColors = Object.values(Color).filter((c) => {
    return !!otherProps[c];
  });
  if (matchedColors.length > 0) {
    return matchedColors[0];
  }
  return otherProps.color;
}

function getPropWeight(otherProps) {
  if (otherProps.bold) {
    return Weight.boldest;
  }
  if (otherProps.light) {
    return Weight.lightest;
  }
  const matchedWeights = Object.values(Weight).filter((w) => {
    return !!otherProps[w];
  });
  if (matchedWeights.length > 0) {
    return matchedWeights[0];
  }
  return otherProps.weight;
}

function filteredProps(otherProps) {
  const propTypesKeys = Object.keys(propTypes);
  return Object.keys(otherProps)
    .filter((key) => !propTypesKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = otherProps[key];
      return obj;
    }, {});
}

const styles = customStyleSheet(() => ({
  ...getTypographyStyles(),
}));

function BaseButton({
  children,

  className,

  ...otherProps
}) {
  const size = getPropSize(otherProps) || Size.regular;
  const color = getPropColor(otherProps) || Color.default;
  const weight = getPropWeight(otherProps) || Weight.default;
  return (
    <button
      className={cx(
        css(
          styles[`size_${size}`],
          styles[`color_${color}`],
          styles[`weight_${size}_${weight}`],
          styles[`leading_${size}`],
          styles[`text_align_center`]
        ),
        className
      )}
      {...filteredProps(otherProps)}
    >
      {children}
    </button>
  );
}

BaseButton.propTypes = propTypes;
BaseButton.defaultProps = defaultProps;

export default BaseButton;
