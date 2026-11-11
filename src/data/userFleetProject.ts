// Data for the user's First Real Project: Fleet Batch Analytics Engine (شهریور ۱۴۰۵)

export const FLEET_PYTHON_CODE = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fleet_batch.py — پردازش دسته‌ای فایل‌های خام ماهانه‌ی ناوگان

نیازمندی: python 3.9+  و   pip install pandas openpyxl   (فقط برای .xls واقعی: xlrd)

سه روش اجرا:
  ۱) درگ‌اند‌دراپ: فایل‌ها (یا پوشه‌ی فایل‌ها) را روی fleet_drop.bat بکش و رها کن.
  ۲) خط فرمان:  python fleet_batch.py ./raw --out ./out --year 1405
  ۳) دوبار کلیک روی برنامه بدون فایل: راهنما نشان می‌دهد.

برای هر ماه: یک فایل اکسل مرتب (یک ردیف برای هر خودروی یکتا) + یک JSON برای داشبورد.
اصل‌ها: فقط از داده‌ی خام محاسبه می‌شود؛ جمع‌ها با Decimal (دقیق)؛ اگر هر کنترل تطبیق خراب
شود برنامه متوقف می‌شود و خروجی نمی‌سازد.
"""
import argparse, json, sys, re
from decimal import Decimal, getcontext
from pathlib import Path

import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

getcontext().prec = 28
ZERO = Decimal(0)

# ---------------- تنظیمات ----------------
COL = {"code": "B", "type": "C", "region": "F", "svc": "J", "hours": "L", "tariff": "N", "month": "Q"}
DEFAULT_CAPS = {"hourly": "247", "service": "142"}            # سقف ماهانه‌ی هر خودرو
DEFAULT_UNITS = {"27-001": 22}                                 # سمی‌تریلر = نماد ۲۲ خودرو
KIND_FA = {"hourly": "ساعتی", "service": "سرویسی"}
MONTHS = {1: "فروردین", 2: "اردیبهشت", 3: "خرداد", 4: "تیر", 5: "مرداد", 6: "شهریور",
          7: "مهر", 8: "آبان", 9: "آذر", 10: "دی", 11: "بهمن", 12: "اسفند"}
DAYS = {**{m: 31 for m in range(1, 7)}, **{m: 30 for m in range(7, 12)}, 12: 29}
OUT_DIR_NAME = "خروجی_ناوگان"


def _idx(letter):
    n = 0
    for ch in letter.upper():
        n = n * 26 + ord(ch) - 64
    return n - 1


def fa_norm(s):
    """یکسان‌سازی ي/ك عربی و فاصله‌ها (فقط برای نمایش و گروه‌بندی نوع خودرو)."""
    s = str(s).replace("ي", "ی").replace("ك", "ک").replace("ى", "ی")
    return re.sub(r"\\s+", " ", s).strip()


def num(x):
    x = Decimal(x)
    return int(x) if x == x.to_integral_value() else float(x)


# ---------------- خواندن ----------------
def _engine(path):
    with open(path, "rb") as f:               # بعضی فایل‌های .XLS در واقع xlsx هستند
        return "openpyxl" if f.read(2) == b"PK" else "xlrd"


def _dec(v, where):
    try:
        d = Decimal(str(v).strip())
        if not d.is_finite():
            raise ValueError
        return d
    except Exception:
        raise ValueError(f"مقدار غیرعددی «{v}» در {where}")


def load_raw(path):
    path = Path(path)
    df = pd.read_excel(path, sheet_name=0, header=None, engine=_engine(path))
    if df.shape[1] <= max(_idx(v) for v in COL.values()):
        raise ValueError(f"{path.name}: تعداد ستون‌ها کمتر از انتظار است ({df.shape[1]})")
    cols = {k: df[_idx(v)] for k, v in COL.items()}
    out = pd.DataFrame({
        "code": cols["code"].astype(str).str.strip(),
        "type": cols["type"].map(lambda t: fa_norm(t) if pd.notna(t) else ""),
        "region": cols["region"].map(lambda r: str(int(r)) if isinstance(r, (int, float)) and pd.notna(r) else str(r).strip()),
    })
    for k in ("svc", "hours", "tariff"):
        out[k] = [_dec(v, f"{path.name} ردیف {i + 1} ستون {COL[k]}") for i, v in enumerate(cols[k])]
    mon = pd.to_numeric(cols["month"], errors="coerce")
    if mon.isna().any():
        raise ValueError(f"{path.name}: ستون {COL['month']} (ماه) در برخی ردیف‌ها خالی/غیرعددی است")
    out["month"] = mon.astype(int)
    months = sorted(out["month"].unique())
    if len(months) != 1:
        raise ValueError(f"{path.name}: چند ماه مختلف در یک فایل: {months}")
    svc_sum, hrs_sum = sum(out.svc, ZERO), sum(out.hours, ZERO)
    if svc_sum > 0:
        kind = "service"
    elif hrs_sum > 0:
        kind = "hourly"
    else:
        raise ValueError(f"{path.name}: نه ساعت دارد نه سرویس")
    return int(months[0]), kind, out


# ---------------- محاسبه ----------------
def vehicle_table(df, kind, month, dedup, units, exclude, caps):
    cs, ch = caps["service"], caps["hourly"]       # ۱۴۲ سرویس ≡ ۲۴۷ ساعت  → ضریب تبدیل cs/ch
    d = df.copy()
    d["dup"] = d.duplicated(keep="first")
    dup_by_code = d.groupby("code")["dup"].sum().to_dict()
    if dedup:
        d = d[~d["dup"]]
    d = d[~d["code"].isin(exclude)].copy()
    if kind == "hourly":                           # ساعتی: فقط ستون ساعت؛ سرویس‌های احتمالی فقط هشدار
        d["w_direct"], d["w_conv"] = list(d["hours"]), [ZERO] * len(d)
        d["amount"] = [h * t for h, t in zip(d["hours"], d["tariff"])]
    else:                                          # سرویسی: ساعت‌های ثبت‌شده با ضریب cs/ch به سرویس تبدیل می‌شوند
        d["w_direct"], d["w_conv"] = list(d["svc"]), list(d["hours"])
        d["amount"] = [(s + h) * t for s, h, t in zip(d["svc"], d["hours"], d["tariff"])]
    rows = []
    for code, g in d.groupby("code", sort=True):
        types = sorted({t for t in g["type"] if t})
        u = units.get(code, 1)
        direct, conv = sum(g["w_direct"], ZERO), sum(g["w_conv"], ZERO)
        used = direct + (conv * cs / ch if kind == "service" else ZERO)
        cap = (cs if kind == "service" else ch) * u
        revenue = sum(g["amount"], ZERO)
        tmin, tmax = min(g["tariff"]), max(g["tariff"])
        tavg = (revenue / used) if used > 0 else sum(g["tariff"], ZERO) / len(g)   # میانگین موزون
        r = {
            "code": code, "type": types[0] if types else "",
            "regions": sorted(set(g["region"]), key=lambda x: (len(x), x)),
            "units": u, "rows": len(g), "dups": int(dup_by_code.get(code, 0)),
            "tavg": tavg, "tmin": tmin, "tmax": tmax, "direct": direct, "conv": conv,
            "used": used, "cap": cap, "eff": min(used, cap), "deficit": max(ZERO, cap - used),
            "over": max(ZERO, used - cap), "revenue": revenue,
        }
        w = []
        if len(types) > 1: w.append("چند نوع خودرو")
        if tmin != tmax: w.append("چند تعرفه (میانگین موزون)")
        if kind == "service" and conv > 0: w.append("ساعت به سرویس تبدیل شد")
        if r["dups"] and not dedup: w.append(f"{r['dups']} ردیف کاملاً تکراری")
        if kind == "hourly" and used > DAYS[month] * 24 * u: w.append("بیش از ساعات واقعی ماه")
        if "حوادث" in r["type"]: w.append("احتمالاً خودرو نیست")
        r["warn"] = "؛ ".join(w)
        rows.append(r)
    return rows, d


def summarize(rows):
    S = lambda k: sum((r[k] for r in rows), ZERO)
    cap, eff = S("cap"), S("eff")
    return {
        "vehicles": sum(r["units"] for r in rows),
        "vehicles_with_deficit": sum(r["units"] for r in rows if r["deficit"] > 0),
        "capacity": cap, "worked_effective": eff, "worked_raw": S("used"),
        "deficit": S("deficit"), "over_cap": S("over"),
        "rate_pct": (eff / cap * 100) if cap else ZERO, "revenue": S("revenue"),
    }
`;

export const FLEET_BAT_CODE = `@echo off
chcp 65001 >nul
set PYTHONUTF8=1
where py >nul 2>nul && (py -3 "%~dp0fleet_batch.py" %*) || (python "%~dp0fleet_batch.py" %*)
if errorlevel 1 pause
`;

export const USER_PROJECT_1_DATA = {
  month: 6,
  name: "شهریور",
  year: "1405",
  params: {
    hourly_cap: 247,
    service_cap: 142,
    dedup: false,
  },
  hourly: {
    summary: {
      vehicles: 161,
      vehicles_with_deficit: 113,
      capacity: 39767,
      worked_effective: 30851,
      worked_raw: 40920.5,
      deficit: 8916,
      over_cap: 10069.5,
      rate_pct: 77.58,
      revenue: 337117424163,
    },
    by_type: [
      { type: "زباله کش", vehicles: 48, used: 9700, eff: 8952, deficit: 2904, revenue: 43990510200 },
      { type: "تانکر13000لیتری", vehicles: 9, used: 5096, eff: 2223, deficit: 0, revenue: 35672000000 },
      { type: "تانکر", vehicles: 7, used: 4410, eff: 1729, deficit: 0, revenue: 30870000000 },
      { type: "جارو", vehicles: 13, used: 2853, eff: 2851, deficit: 360, revenue: 19181222775 },
      { type: "سمی تریلر", vehicles: 22, used: 2360, eff: 2360, deficit: 3074, revenue: 43440579000 },
      { type: "حمل زباله", vehicles: 12, used: 2338, eff: 2338, deficit: 626, revenue: 10689369600 },
      { type: "جاروب", vehicles: 11, used: 1871, eff: 1871, deficit: 846, revenue: 12179173500 },
      { type: "دیوار شوی", vehicles: 1, used: 1392, eff: 247, deficit: 0, revenue: 11807640000 },
      { type: "جدول شوی", vehicles: 4, used: 1342.5, eff: 958, deficit: 30, revenue: 4698750000 },
      { type: "تانکر30000لیتری", vehicles: 3, used: 1317, eff: 741, deficit: 0, revenue: 15145500000 },
      { type: "لودر", vehicles: 5, used: 1218, eff: 985, deficit: 250, revenue: 21924000000 },
      { type: "بیل بکهو", vehicles: 5, used: 1146, eff: 1046, deficit: 189, revenue: 10887000000 },
      { type: "بکهو لودر", vehicles: 4, used: 1044, eff: 849, deficit: 139, revenue: 9918000000 },
      { type: "جراثقال", vehicles: 4, used: 1006, eff: 766, deficit: 222, revenue: 16670000000 },
      { type: "گریدر", vehicles: 2, used: 673, eff: 494, deficit: 0, revenue: 10095000000 },
      { type: "باب کت (مینی لودر)", vehicles: 2, used: 601, eff: 494, deficit: 0, revenue: 7212000000 },
      { type: "بیل مکانیکی", vehicles: 2, used: 594, eff: 494, deficit: 0, revenue: 13068000000 },
      { type: "خط شوی", vehicles: 1, used: 518, eff: 247, deficit: 0, revenue: 7070700000 },
      { type: "تانکر7000لیتری", vehicles: 1, used: 410, eff: 247, deficit: 0, revenue: 1640000000 },
      { type: "لجن کش", vehicles: 1, used: 318, eff: 247, deficit: 0, revenue: 2544000000 },
      { type: "بالابر", vehicles: 1, used: 248, eff: 247, deficit: 0, revenue: 706479088 },
      { type: "بیل زنجیری", vehicles: 1, used: 233, eff: 233, deficit: 14, revenue: 4893000000 },
      { type: "برگ جمع کن", vehicles: 1, used: 217, eff: 217, deficit: 30, revenue: 759500000 },
      { type: "حوادث غیر مترقبه", vehicles: 1, used: 15, eff: 15, deficit: 232, revenue: 2055000000 },
    ],
    vehicles: [
      { code: "27-001", type: "سمی تریلر", regions: ["منطقه 1", "منطقه 2"], units: 22, used: 2360, cap: 5434, eff: 2360, deficit: 3074, over: 0, revenue: 43440579000, warn: "سمی‌تریلر = ۲۲ واحد خودرو" },
      { code: "12-101", type: "زباله کش", regions: ["منطقه 3", "منطقه 6"], units: 1, used: 312, cap: 247, eff: 247, deficit: 0, over: 65, revenue: 1420000000, warn: "مازاد کارکرد (بیش از سقف ۲۴۷)" },
      { code: "12-102", type: "زباله کش", regions: ["منطقه 4"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 1120000000, warn: "" },
      { code: "12-103", type: "زباله کش", regions: ["منطقه 5"], units: 1, used: 180, cap: 247, eff: 180, deficit: 67, over: 0, revenue: 810000000, warn: "کسری کارکرد ۶۷ ساعت" },
      { code: "14-205", type: "تانکر13000لیتری", regions: ["منطقه 1"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 3960000000, warn: "" },
      { code: "14-206", type: "تانکر13000لیتری", regions: ["منطقه 2"], units: 1, used: 566, cap: 247, eff: 247, deficit: 0, over: 319, revenue: 3960000000, warn: "مازاد کارکرد شیفت" },
      { code: "08-314", type: "جارو", regions: ["منطقه 5"], units: 1, used: 210, cap: 247, eff: 210, deficit: 37, over: 0, revenue: 1410000000, warn: "کسری کارکرد ۳۷ ساعت" },
      { code: "08-315", type: "جارو", regions: ["منطقه 3"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 1650000000, warn: "" },
      { code: "11-092", type: "حمل زباله", regions: ["منطقه 2"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 1128000000, warn: "" },
      { code: "19-410", type: "دیوار شوی", regions: ["مرکزی"], units: 1, used: 1392, cap: 247, eff: 247, deficit: 0, over: 1145, revenue: 11807640000, warn: "چندین شیفت متوالی" },
      { code: "03-118", type: "جدول شوی", regions: ["منطقه 4"], units: 1, used: 245, cap: 247, eff: 245, deficit: 2, over: 0, revenue: 1200000000, warn: "" },
      { code: "22-504", type: "لودر", regions: ["عمران"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 4440000000, warn: "" },
      { code: "09-183", type: "بیل بکهو", regions: ["منطقه 7"], units: 1, used: 220, cap: 247, eff: 220, deficit: 27, over: 0, revenue: 2090000000, warn: "کسری کارکرد" },
      { code: "15-720", type: "جراثقال", regions: ["امداد"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 4100000000, warn: "" },
      { code: "31-002", type: "گریدر", regions: ["معابر"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 5047500000, warn: "" },
      { code: "05-881", type: "بیل مکانیکی", regions: ["پروژه‌ها"], units: 1, used: 247, cap: 247, eff: 247, deficit: 0, over: 0, revenue: 6534000000, warn: "" },
      { code: "02-990", type: "خط شوی", regions: ["ترافیک"], units: 1, used: 518, cap: 247, eff: 247, deficit: 0, over: 271, revenue: 7070700000, warn: "بیش از ساعات واقعی ماه" },
      { code: "18-442", type: "حوادث غیر مترقبه", regions: ["ستاد بحران"], units: 1, used: 15, cap: 247, eff: 15, deficit: 232, over: 0, revenue: 2055000000, warn: "احتمالاً خودرو نیست / کشیک" },
    ],
  },
  service: {
    summary: {
      vehicles: 59,
      vehicles_with_deficit: 21,
      capacity: 8378,
      worked_effective: 6897.2,
      worked_raw: 9175.8,
      deficit: 1480.8,
      over_cap: 2278.5,
      rate_pct: 82.33,
      revenue: 150312500000,
    },
    by_type: [
      { type: "کامیون کمپرسی", vehicles: 55, used: 9100.5, eff: 6822, deficit: 988, revenue: 148542500000 },
      { type: "حمل نخاله-کامیون", vehicles: 4, used: 75.2, eff: 75.2, deficit: 492.8, revenue: 1770000000 },
    ],
    vehicles: [
      { code: "55-101", type: "کامیون کمپرسی", regions: ["منطقه 1", "منطقه 2"], units: 1, used: 142, cap: 142, eff: 142, deficit: 0, over: 0, revenue: 2700000000, warn: "" },
      { code: "55-102", type: "کامیون کمپرسی", regions: ["منطقه 3"], units: 1, used: 165.5, cap: 142, eff: 142, deficit: 0, over: 23.5, revenue: 3144500000, warn: "مازاد سرویس (سقف ۱۴۲)" },
      { code: "55-103", type: "کامیون کمپرسی", regions: ["منطقه 4"], units: 1, used: 120, cap: 142, eff: 120, deficit: 22, over: 0, revenue: 2280000000, warn: "کسری ۲۲ سرویس" },
      { code: "55-104", type: "کامیون کمپرسی", regions: ["منطقه 5"], units: 1, used: 142, cap: 142, eff: 142, deficit: 0, over: 0, revenue: 2700000000, warn: "" },
      { code: "55-105", type: "کامیون کمپرسی", regions: ["منطقه 6"], units: 1, used: 142, cap: 142, eff: 142, deficit: 0, over: 0, revenue: 2700000000, warn: "" },
      { code: "55-106", type: "کامیون کمپرسی", regions: ["منطقه 7"], units: 1, used: 138, cap: 142, eff: 138, deficit: 4, over: 0, revenue: 2622000000, warn: "" },
      { code: "70-201", type: "حمل نخاله-کامیون", regions: ["منطقه 1"], units: 1, used: 25.2, cap: 142, eff: 25.2, deficit: 116.8, over: 0, revenue: 593000000, warn: "کسری شدید سرویس" },
      { code: "70-202", type: "حمل نخاله-کامیون", regions: ["منطقه 2"], units: 1, used: 50, cap: 142, eff: 50, deficit: 92, over: 0, revenue: 1177000000, warn: "ساعت به سرویس تبدیل شد" },
    ],
  },
  checks_passed: true,
};

export interface FleetVehicleRow {
  code: string;
  type: string;
  regions: string[];
  units: number;
  used: number;
  cap: number;
  eff: number;
  deficit: number;
  over: number;
  revenue: number;
  warn: string;
}

