// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import BwipJs from 'bwip-js';

// const BarcodeGenerator = ({ productData }) => {
//     const [barcode, setBarcode] = useState('');
//     const [barcodeDisplayed, setBarcodeDisplayed] = useState(false);

//     useEffect(() => {
//         console.log("Hiiiiiii BarcodeGenerator");
//         if (productData && productData.id && !barcodeDisplayed) {
//             try {
//                 const canvas = document.createElement('canvas');
//                 BwipJs.toCanvas(canvas, {
//                     bcid: 'code128',
//                     text: productData.id.toString(),//המרה לסטרינג כי אחרת לא מציג
//                     scale: 3,
//                     height: 10,
//                     includetext: true,
//                     textxalign: 'center',
//                     textyoffset: 3,
//                 });
//                 const barcodeDataUrl = canvas.toDataURL('image/png');
//                 setBarcode(barcodeDataUrl);
//                 setBarcodeDisplayed(true); // Update the state to indicate barcode has been displayed
//             } catch (err) {
//                 console.error('שגיאה ביצירת הברקוד:', err);
//             }
//         }
//     }, [productData, barcodeDisplayed]);

//     const handlePrintLabel = () => {
//         const printWindow = window.open('', '_blank');
//         printWindow.document.write(`
//             <html>
//               <head>
//              <style>
//                  body { 
//                      margin: 0; 
//                      padding: 10px; 
//                      text-align: center; 
//                      font-family: Arial, sans-serif; 
//                      background-color: #f4f4f4;
//                  }

//                  .label {
//                      display: flex;
//                      flex-direction: column;
//                      align-items: center;
//                      justify-content: center;
//                      border: 2px solid #3f51b5; 
//                      border-radius: 10px; 
//                      padding: 20px; 
//                      background-color: white; 
//                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
//                      width: fit-content;
//                      margin: 0 auto;
//                      max-width: 300px; 
//                  }

//                  .label-title { 
//                      font-size: 22px; 
//                      font-weight: bold; 
//                      color: #3f51b5; 
//                      margin-bottom: 5px; 
//                      text-align: center; 
//                  }

//                  .label-location { 
//                      font-size: 16px; 
//                      margin-bottom: 15px; 
//                      color: #555; 
//                      text-align: center; 
//                  }

//                  img { 
//                      max-width: 100%; 
//                      height: auto; 
//                  }
//              </style>
//          </head>

//                 <body>
//                     <div class="label">
//                         <div class="label-title">שם המוצר : ${productData.title}</div>
//                         <div class="label-location">מיקום :${productData.location}</div>
//                         <img src="${barcode}" alt="Barcode" />
//                     </div>
//                 </body>
//             </html>
//         `);
//         printWindow.document.close();
//         printWindow.print();
//     };

//     return (
//         <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
//             {barcode && (
//                 <>
//                     <Box mt={4}>
//                         <img src={barcode} alt={`Barcode for product ${productData.id}`} />
//                     </Box>
//                     <Button
//                         variant="contained"
//                         color="secondary"
//                         onClick={handlePrintLabel}
//                         sx={{ mt: 2 }}
//                     >
//                         הדפסת הברקוד
//                     </Button>
//                 </>
//             )}
//         </Box>
//     );
// };

// export default BarcodeGenerator;

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import BwipJs from 'bwip-js';

const BarcodeGenerator = ({ productData }) => {
    const [barcode, setBarcode] = useState('');
    const [barcodeDisplayed, setBarcodeDisplayed] = useState(false);

    useEffect(() => {
        if (productData && productData.id && !barcodeDisplayed) {
            try {
                const canvas = document.createElement('canvas');
                BwipJs.toCanvas(canvas, {
                    bcid: 'code128',
                    text: productData.id.toString(),
                    scale: 3,
                    height: 10,
                    includetext: true,
                    textxalign: 'center',
                    textyoffset: 3,
                });
                const barcodeDataUrl = canvas.toDataURL('image/png');
                setBarcode(barcodeDataUrl);
                setBarcodeDisplayed(true);
            } catch (err) {
                console.error('שגיאה ביצירת הברקוד:', err);
            }
        }
    }, [productData, barcodeDisplayed]);

    const handlePrintLabel = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
              <head>
                 <style>
                     body { 
                         margin: 0; 
                         padding: 10px; 
                         text-align: center; 
                         font-family: Arial, sans-serif; 
                         background-color: #f4f4f4;
                     }.label {
                         display: flex;
                         flex-direction: column;
                         align-items: center;
                         justify-content: center;
                         border: 2px solid #3f51b5; 
                         border-radius: 10px; 
                         padding: 20px; 
                         background-color: white; 
                         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
                         width: fit-content;
                         margin: 0 auto;
                         max-width: 300px; 
                     } .label-title { 
                         font-size: 22px; 
                         font-weight: bold; 
                         color: #3f51b5; 
                         margin-bottom: 5px; 
                         text-align: center; 
                     } .label-location { 
                         font-size: 16px; 
                         margin-bottom: 15px; 
                         color: #555; 
                         text-align: center; 
                     }  
                     img { 
                         max-width: 100%; 
                         height: auto; 
                     }
                 </style>
             </head>
                <body>
                    <div class="label">
                        <div class="label-title">שם המוצר: ${productData.title}</div>
                        <div class="label-location">מיקום: ${productData.location}</div>
                        <img src="${barcode}" alt="Barcode" />
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            {barcode && (
                <>
                    <Typography variant="h6" gutterBottom>
                        שם המוצר: {productData.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        מיקום: {productData.location}
                    </Typography>
                    <Box mt={4}>
                        <img src={barcode} alt={`Barcode for product ${productData.id}`} />
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handlePrintLabel}
                        sx={{ mt: 2 }}
                    >
                        הדפסת הברקוד
                    </Button>
                </>
            )}
        </Box>
    );
};

export default BarcodeGenerator;
