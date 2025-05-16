"""
Specialized handlers for predefined questions in the chatbot.
"""

from langchain.prompts import PromptTemplate

# Dictionary mapping predefined questions to optimized search queries
QUERY_REWRITES = {
    "What is the diesel subsidy policy?": "Malaysia diesel subsidy policy reform targeted 2024 explanation",
    "Why was the policy necessary?": "Malaysia diesel subsidy reform reasons justification fiscal burden subsidy cost cross-border leakage 2019 2023",
    "Who benefits from the policy?": "Malaysia diesel subsidy reform beneficiaries target groups low-income farmers fishermen transport operators",
    "What is the eligibility criteria?": "Malaysia diesel subsidy eligibility requirements criteria Malaysian citizenship income vehicle registration MADANI",
    "What is the application process?": "Malaysia diesel subsidy application process steps MADANI portal documents verification timeline disbursement",
    "What are the benefits of this policy?": "Malaysia diesel subsidy reform benefits advantages fiscal savings targeted welfare reduced leakage environmental sustainability",
    "What is Consumer Price Index?": "Malaysia Consumer Price Index CPI definition explanation calculation impact inflation",
    # "How much did diesel price increase?": "Malaysia diesel price increase RM2.15 RM3.35 peninsula Sabah Sarawak",
    # "When was the diesel subsidy reform implemented?": "Malaysia diesel subsidy reform implementation date June 2024",
    # "Why was the diesel subsidy reformed?": "Malaysia diesel subsidy reform reasons cost fiscal burden cross-border leakage",
    # "Who is eligible for diesel subsidies?": "Malaysia diesel subsidy eligibility criteria targeted beneficiaries",
    # "How do I apply for diesel subsidies?": "Malaysia diesel subsidy application process MADANI portal requirements",
    # "What documents are needed for subsidy application?": "Malaysia diesel subsidy application documents requirements MyKad income proof vehicle",
    # "Can foreigners apply for diesel subsidies?": "Malaysia diesel subsidy eligibility citizenship requirements foreigners",
    # "How does diesel policy affect inflation?": "Malaysia diesel subsidy inflation impact CPI consumer prices",
    # "What is the impact on manufacturing?": "Malaysia diesel subsidy manufacturing industry production cost impact",
    # "How much does the government save from the reform?": "Malaysia diesel subsidy reform government savings RM4 billion fiscal",
    # "Will food prices increase due to diesel subsidy removal?": "Malaysia diesel subsidy food prices impact transportation logistics costs",
    # "How can I calculate the impact on my budget?": "Malaysia diesel price increase personal budget impact calculation",
    # "What is the monthly subsidy amount?": "Malaysia diesel subsidy amount RM200 monthly cash assistance",
    # "How do I get the subsidy if I'm eligible?": "Malaysia diesel subsidy disbursement process bank transfer",
    # "Are there other subsidies available?": "Malaysia other subsidies programs besides diesel MADANI assistance"
}

# Enhanced system prompts for specific questions
ENHANCED_PROMPTS = {
    "What is the diesel subsidy policy?": """

Provide a brief overview of 2 to 3 sentences of Malaysia's 2024 Diesel Subsidy Policy reform and include:
1. The shift from a blanket subsidy to targeted subsidies
2. The key diesel price change.

Use simple language suitable for the average Malaysian citizen. Be informative, factual and concise. 
""",

    "Why was the policy necessary?": """

Provide a brief 2-3 sentence explanation focusing only on:
1. The dramatic increase in subsidy costs (mention the 2019 vs 2023 figures)
2. The main problem this caused (fiscal burden OR cross-border leakage)

Keep your response under 50 words. Be informative and factual.
""",

    "Who benefits from the policy?": """

List only the main beneficiary categories in 1-2 sentences. If available, mention:
- Private vehicle owners (specify the possible number of owners that would benefit)
- Farmers, livestock breeders, and fishers
- Special consideration for East Malaysia

Keep your response under 50 words. Be informative, concise and factual.
""",

    "What is the eligibility criteria?": """

List only the 3-4 main eligibility requirements in bullet point format:
- Malaysian citizenship requirement
- Income threshold (specific amount if available)
- Vehicle requirements (age, type)
- Any special category provisions

Present this as a structured list of requirements that someone can easily check against their situation. Keep your response under 60 words. Be informative, concise and factual.

End your answer with: "Applications can be submitted through the MADANI portal at https://budimadani.gov.my/ where detailed eligibility verification takes place."
""",

    "What is the application process?": """

List the application process as brief bullet points containing:
- Documents needed
- Where to apply
- Verification process
- Disbursement method

Use a chronological, step-by-step format that makes the process easy to follow.

End your answer with: "For assistance with your application or to check your application status, visit https://budimadani.gov.my/"
""",

    "What are the benefits of this policy?": """

You are explaining the benefits of Malaysia's diesel subsidy reform implemented in June 2024. Focus on providing a balanced overview of the main advantages:
1. Fiscal sustainability:
    - Mention the annual government savings (RM4 billion) and its impact on budget deficit
2. Social equity benefits:
    - Explain how targeted subsidies direct resources to those who truly need them
3. Economic efficiency:
    - Note the reduction in cross-border leakage and more efficient resource allocation
4. Environmental impact:
    - Briefly mention how it encourages more fuel-efficient practices
5. Long-term strategic advantages:
    - Highlight how it creates fiscal space for critical investments and improves economic resilience

Use a numbering system to highlight the advantages.

Present a balanced view that acknowledges both immediate benefits and long-term advantages.

End your answer with: "While the transition may present short-term challenges for some consumers, the reform creates a more sustainable, equitable, and efficient system that benefits Malaysia's long-term economic and environmental health."
""",
    "What is Consumer Price Index?": """
Provide a clear, concise 2-3 sentence explanation of what the Consumer Price Index (CPI) is in Malaysia. Include:
1. A simple definition of CPI that a non-economist would understand
2. What CPI measures and how it relates to inflation
3. Why CPI matters for understanding policy impacts

Use straightforward language suitable for the average citizen. Avoid technical economic jargon where possible. Be informative, factual and concise.
""",
}

FORMATTING_SUFFIX = """
Format your answer with proper HTML:
- Use <p> tags for paragraphs
- Use <ol> and <li> tags for numbered lists
- Use <ul> and <li> tags for bullet points
- Use <strong> tags for emphasis

Ensure numbers and formatting in your answer are represented with HTML tags.
"""

def get_optimized_query(original_question):
    """
    Returns an optimized search query for predefined questions,
    or the original question if no optimization is available.
    """
    # return QUERY_REWRITES.get(original_question, original_question)
    return QUERY_REWRITES.get(original_question, original_question)

def get_enhanced_prompt_template(question):
    """
    Returns an enhanced prompt template for predefined questions,
    or None if no enhancement is available.
    """
    raw_prompt = ENHANCED_PROMPTS.get(question)
    if raw_prompt:
        # Create a system prompt with the enhanced instructions and formatting
        system_prompt = raw_prompt + "\n\n" + FORMATTING_SUFFIX
        
        # Create a template for the human message that includes context and question
        human_template = """
        Context: {context}
        
        Question: {question}
        """
        
        return {
            "system_content": system_prompt,
            "human_template": PromptTemplate(
                template=human_template,
                input_variables=["context", "question"]
            )
        }
    return None

def get_default_prompt_template():
    """
    Returns the default prompt template for regular queries.
    """
    # System content for default prompt
    system_content = """
    You are a helpful assistant that specializes in explaining Malaysia's diesel subsidy policy.
    """ + FORMATTING_SUFFIX
    
    # Human template with context and question
    human_template = """
    Use the following pieces of retrieved context to answer the user's question.
    
    If the necessary information to answer the question is not contained in the context below,
    respond with: "I'm sorry, I don't have that specific information in my knowledge base. 
    The question you've asked is outside the context of the information available to me. 
    Please try asking about the diesel subsidy policy details, eligibility criteria, 
    or implementation timeline."
    
    Do not make up or infer information that is not directly supported by the context.
    
    Context: {context}
    
    Question: {question}
    """
    
    return {
        "system_content": system_content,
        "human_template": PromptTemplate(
            template=human_template,
            input_variables=["context", "question"]
        )
    }