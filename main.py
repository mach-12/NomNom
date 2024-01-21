from flask import Flask, request, jsonify
from langchain_community.llms import Ollama
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.document_loaders import WebBaseLoader
from langchain.embeddings import GPT4AllEmbeddings
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.chains.router import MultiPromptChain
from langchain.chains.router.llm_router import LLMRouterChain,RouterOutputParser

llm = Ollama(
    model="llama2", callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]), temperature=0.4
)

loader = WebBaseLoader("https://www.healthline.com/nutrition/50-super-healthy-foods#meat")
data = loader.load()

embeddings = GPT4AllEmbeddings()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
texts = text_splitter.split_documents(data)

db = FAISS.from_documents(texts, embeddings)
retriever = db.as_retriever()
chain = ConversationalRetrievalChain.from_llm(llm, retriever, return_source_documents=True )

app = Flask(__name__)

nutrition_template =  '''
    You are a nutritionist called nom nom who gives max 5 line answers.Provide personalized nutrition and exercise advice for health conscious people based on their preferences allergies other relevant health information.
    here is the query: {query}
    '''


prompt = PromptTemplate(template=nutrition_template, input_variables=["query"])

@app.route('/chat', methods=['POST'])
def chat():
     data = request.get_json()
     if 'question' in data:
        _input = prompt.format_prompt(query=data['question'])
        output = llm(_input.to_string())
        return jsonify({'response': output})
     else:
        return jsonify({'error': 'No question provided'})

if __name__ == '__main__':
    app.run(debug=True)