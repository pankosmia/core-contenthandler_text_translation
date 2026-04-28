import { Button, Typography, Box } from "@mui/material";

export function TestPptrFirefox() {
  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="contained"
        onClick={async () => {
          const filePath = await window.api.generatePdf();
          console.log("PDF created at:", filePath);
        }}
      >
        pdfGen
      </Button>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Regular
      </Typography>

      <Typography dir="rtl">
        اقوام متحدہ نے ہر ک
        <Typography component="span" color="error">
          ہ
        </Typography>
        یں دے حقوق دی حفاظت تے ود
        <Typography component="span" color="error">
          ھ
        </Typography>
        ارے دا جھنڈا اچار ک
        <Typography component="span" color="error">
          ک
        </Typography>
        ھ
        <Typography component="span" color="error">
          ں
        </Typography>
        دا ارادہ کیتا ہوئے اے
        <Typography component="span" color="error">
          ہ
        </Typography>
        ؤے و حشیانہ کماں دی صورت وچ ظاہر تھی
        <Typography component="span" color="error">
          ئ
        </Typography>
        ی ہں
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Bold
      </Typography>

      <Typography dir="rtl">
        اقوام متحدہ نے ہر ک
        <Typography component="span" color="error">
          ہ
        </Typography>
        یں دے حقوق دی حفاظت تے ود
        <Typography component="span" color="error">
          ھ
        </Typography>
        ارے دا جھنڈا اچار ک
        <Typography component="span" color="error">
          ک
        </Typography>
        ھ
        <Typography component="span" color="error">
          ں
        </Typography>
        دا ارادہ کیتا ہوئے اے
        <Typography component="span" color="error">
          ہ
        </Typography>
        ؤے و حشیانہ کماں دی صورت وچ ظاہر تھی
        <Typography component="span" color="error">
          ئ
        </Typography>
        ی ہں
      </Typography>
    </Box>
  );
}
