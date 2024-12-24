import * as React from "react";

import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

const Portfolio = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    // Adjusted the viewBox to remove padding from the bottom
    viewBox="9166 370 70.884 56.924" // Reduced the height by 5 to remove bottom padding
    width={65}
    height={48}
    preserveAspectRatio="none" // Ensure it doesn't crop or distort
    {...props}
  >
    <Defs>
      <ClipPath id="clip-path">
        <Path
          id="Path_141"
          data-name="Path 141"
          fill="none"
          d="M0-51.924H70.884V0H0Z"
          transform="translate(0 51.924)"
        />
      </ClipPath>
    </Defs>
    <G id="Group_312" data-name="Group 312" transform="translate(9166 370)">
      <G id="Group_311" data-name="Group 311" className="cls-2">
        <G id="Group_306" data-name="Group 306">
          <Path
            id="Path_135"
            data-name="Path 135"
            fill="#e31837"
            d="M0,0,13.129-5.669A15.222,15.222,0,0,0,0-14.316Z"
            transform="translate(56.269 14.316)"
          />
        </G>
        <G id="Group_307" data-name="Group 307">
          <Path
            id="Path_136"
            data-name="Path 136"
            fill="#e31837"
            d="M0,0V-15.4A15.221,15.221,0,0,0-14.614-.187,15.222,15.222,0,0,0,.609,15.036a15.152,15.152,0,0,0,8.042-2.3l.009.012.453-.308.016-.01.091-.061Z"
            transform="translate(55.051 15.394)"
          />
        </G>
        <G id="Group_308" data-name="Group 308">
          <Path
            id="Path_137"
            data-name="Path 137"
            fill="#e31837"
            d="M0,0A15.182,15.182,0,0,0-1.006-5.44L-14.292.289l8.644,11.539A15.186,15.186,0,0,0,0,0"
            transform="translate(70.884 15.207)"
          />
        </G>
        <G id="Group_309" data-name="Group 309" transform="translate(2 -3)">
          <Path
            id="Path_138"
            data-name="Path 138"
            fill="#e31837"
            d="M0,0H-2V2H-12V0H-31V18H17V1.632A20.934,20.934,0,0,1,13.826,0Z"
            transform="translate(31 33.924)"
          />
        </G>
        <Path
          id="Path_139"
          data-name="Path 139"
          fill="#e31837"
          d="M29-38H19v-3H29Zm5.9,2.183A20.988,20.988,0,0,1,35.017-38H31v-5H17v5H0v18H19v-2H29v2H42.118A20.935,20.935,0,0,1,34.9-35.817"
          transform="translate(2 48.924)"
        />
      </G>
    </G>
  </Svg>
);

export default Portfolio;

// const Portfolio = (props: any) => (
//   <Svg
//     xmlns="http://www.w3.org/2000/svg"
//     xmlnsXlink="http://www.w3.org/1999/xlink"
//     viewBox="9166 403 70.884 51.924"
//     width={65}
//     height={48}
//     preserveAspectRatio="xMidYMid meet"
//     {...props}
//   >
//     <Defs>
//       <ClipPath id="clip-path">
//         <Path
//           id="Path_141"
//           data-name="Path 141"
//           fill="none"
//           d="M0-51.924H70.884V0H0Z"
//           transform="translate(0 51.924)"
//         />
//       </ClipPath>
//     </Defs>
//     <G id="Group_312" data-name="Group 312" transform="translate(9166 403)">
//       <G id="Group_311" data-name="Group 311" className="cls-2">
//         <G id="Group_306" data-name="Group 306">
//           <Path
//             id="Path_135"
//             data-name="Path 135"
//             fill="#e31837"
//             d="M0,0,13.129-5.669A15.222,15.222,0,0,0,0-14.316Z"
//             transform="translate(56.269 14.316)"
//           />
//         </G>
//         <G id="Group_307" data-name="Group 307">
//           <Path
//             id="Path_136"
//             data-name="Path 136"
//             fill="#e31837"
//             d="M0,0V-15.4A15.221,15.221,0,0,0-14.614-.187,15.222,15.222,0,0,0,.609,15.036a15.152,15.152,0,0,0,8.042-2.3l.009.012.453-.308.016-.01.091-.061Z"
//             transform="translate(55.051 15.394)"
//           />
//         </G>
//         <G id="Group_308" data-name="Group 308">
//           <Path
//             id="Path_137"
//             data-name="Path 137"
//             fill="#e31837"
//             d="M0,0A15.182,15.182,0,0,0-1.006-5.44L-14.292.289l8.644,11.539A15.186,15.186,0,0,0,0,0"
//             transform="translate(70.884 15.207)"
//           />
//         </G>
//         <G id="Group_309" data-name="Group 309" transform="translate(2 -3)">
//           <Path
//             id="Path_138"
//             data-name="Path 138"
//             fill="#e31837"
//             d="M0,0H-2V2H-12V0H-31V18H17V1.632A20.934,20.934,0,0,1,13.826,0Z"
//             transform="translate(31 33.924)"
//           />
//         </G>
//         <Path
//           id="Path_139"
//           data-name="Path 139"
//           fill="#e31837"
//           d="M29-38H19v-3H29Zm5.9,2.183A20.988,20.988,0,0,1,35.017-38H31v-5H17v5H0v18H19v-2H29v2H42.118A20.935,20.935,0,0,1,34.9-35.817"
//           transform="translate(2 48.924)"
//         />
//       </G>
//     </G>
//   </Svg>
// );
// export default Portfolio;
