import streamlit as st 
from streamlit.components.v1 import html
from utils import nav_to_page

if st.button("Go to page 2"):
    nav_to_page("Page2", 1)
