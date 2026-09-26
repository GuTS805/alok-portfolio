"""Run the current portfolio integration checks against PORTFOLIO_URL."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).parent / 'scripts/verify-portfolio.py'), run_name='__main__')
