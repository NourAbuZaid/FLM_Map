import json
import xlsxwriter
from fastscript import *

HEADERS = [
    "desc",
    "date",
    "time",
    "latitude",
    "longitude"
]

def from_fleming(jdata):
    odata = []
    for d in jdata:
        rdata = []
        # TODO: magicking out the relevant cells
        odata.append(rdata)

    return HEADERS, odata

CONVERTER = from_fleming

@call_parse
def main(inp:Param("Input file", str),
         outp:Param("Output file", str)="out.xlsx"):
    workbook = xlsxwriter.Workbook(outp)
    worksheet = workbook.add_worksheet('export_events')

    with open(inp, 'r') as f:
        data = json.load(f)

    conv_data = CONVERTER(data)
    headers = conv_data[0]
    row_data = conv_data[1]

    row = 0
    col = 0

    for hdr in headers:
        worksheet.write(row, col, hdr)
        col += 1

    row = 1
    col = 0

    for rdata in row_data:
        col = 0
        for cell in rdata:
            worksheet.write(row, col, cell)
            col += 1
        row += 1

    workbook.close()



