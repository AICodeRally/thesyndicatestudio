# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['/Users/toddlebaron/dev/spm_tools/tools/spm_monte_carlo/excel_standalone/spm_excel_interface.py'],
    pathex=[],
    binaries=[],
    datas=[('/Users/toddlebaron/dev/spm_tools/tools/spm_monte_carlo/src/spm_monte_carlo', 'spm_monte_carlo')],
    hiddenimports=['spm_monte_carlo', 'spm_monte_carlo.data', 'spm_monte_carlo.statistics', 'spm_monte_carlo.simulation', 'spm_monte_carlo.compensation', 'spm_monte_carlo.exceptions', 'pandas', 'numpy', 'scipy', 'scipy.stats', 'scipy.optimize', 'matplotlib', 'openpyxl', 'xlsxwriter', 'xlwings', 'seaborn'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='spm_mc',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
