# AUTOGENERATED! DO NOT EDIT! File to edit: 00_core.ipynb (unless otherwise specified).

__all__ = ['DEFAULT_HEADERS', 'dt', 'getDate', 'from_fleming', 'main', 'CONVERTER']

# Cell
import json
import xlsxwriter
from datetime import datetime
from fastscript import *

# Cell
DEFAULT_HEADERS = [
    "desc",
    "date",
    "time",
    "latitude",
    "longitude"
]

# Cell
def dt(d: str) -> datetime:
    return datetime.strptime(d, '%Y-%m-%dT%H:%M:%SZ')

def getDate(item: str) -> datetime:
    lspt = item.get('lastSpotted')
    if lspt is not None:
        return dt(lspt)
    startTime = item.get('startTime')
    if startTime is not None:
        return dt(startTime)
    endTime = item.get('endTime')
    if endTime is not None:
        return dt(endTime)
    raise Exception("JSON value doesn't have lastSpotted, startTime, or endTime")

def from_fleming(jdata):
    headers = DEFAULT_HEADERS
    odata = []
    for d in jdata:
        thedate = getDate(d)
        rdata = [
            '0d1f5b02-3178-494b-a0c7-bbc171249e3f',
            datetime.strftime(thedate, '%m/%d/%Y'),
            datetime.strftime(thedate, '%H:%M:%S'),
            d['coordinates']['lat'],
            d['coordinates']['lon'],
        ]
        odata.append(rdata)

    return headers, odata

# Cell
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