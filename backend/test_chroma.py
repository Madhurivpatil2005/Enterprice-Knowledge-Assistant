from app.vectorstore.chroma_client import collection

results = collection.get()

print("=" * 50)
print("Total Stored Chunks:", len(results["ids"]))
print("=" * 50)

for i, doc in enumerate(results["documents"][:5]):
    print(f"\nChunk {i+1}")
    print(doc[:200])