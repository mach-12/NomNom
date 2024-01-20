from streamlit.components.v1 import html
import streamlit as st
from utils import nav_to_page

if st.button("Go to page 1"):
    nav_to_page("Page1")


