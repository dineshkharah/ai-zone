import pandas as pd

# Load the Excel file
xlsx_path = "UpdatedDataset.xlsx"
df = pd.read_excel(xlsx_path)

# Save as CSV
csv_path = "converted_file.csv"
df.to_csv(csv_path, index=False)

print("Conversion done!")