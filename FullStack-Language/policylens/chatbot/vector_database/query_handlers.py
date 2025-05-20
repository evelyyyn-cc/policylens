"""
Specialized handlers for predefined questions and dynamic query rewriting in the chatbot.
"""
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
import os

# Existing dictionary mapping predefined questions to optimized search queries
QUERY_REWRITES = {
    "What is the diesel subsidy policy?": "Malaysia diesel subsidy policy reform targeted 2024 explanation",
    "Why was the policy necessary?": "Malaysia diesel subsidy reform reasons justification fiscal burden subsidy cost cross-border leakage 2019 2023",
    "Who benefits from the policy?": "Malaysia diesel subsidy reform beneficiaries target groups low-income farmers fishermen transport operators",
    "What is the eligibility criteria?": "Malaysia diesel subsidy eligibility requirements criteria Malaysian citizenship income vehicle registration MADANI",
    "What is the application process?": "Malaysia diesel subsidy application process steps MADANI portal documents verification timeline disbursement",
    "What are the benefits of this policy?": "Malaysia diesel subsidy reform benefits advantages fiscal savings targeted welfare reduced leakage environmental sustainability",
    "What is Consumer Price Index?": "Malaysia Consumer Price Index CPI definition explanation calculation impact inflation",
    "What are the most commonly affected sectors?": "Malaysia diesel subsidy removal impact CPI sectors food beverages restaurant accommodation transport utilities percentage affected categories",
    "How does the policy impact consumer price index?": "Malaysia diesel subsidy removal impact CPI consumer price index inflation categories food beverages restaurant accommodation transport utilities state regional differences percentage change",
    "What are the latest CPI values of states?": "Malaysia latest CPI Consumer Price Index values by state regional comparison Johor Kedah Kelantan Melaka Negeri Sembilan Pahang Perak Perlis Pulau Pinang Sabah Sarawak Selangor Kuala Lumpur Labuan Putrajaya",
    "How is the policy going to impact me?": "Malaysia diesel subsidy personal budget calculator household impact expenses transport food housing utilities monthly costs calculator",
    "What is Industrial Production Index?": "Malaysia Industrial Production Index IPI definition explanation DOSM measurement manufacturing mining electricity volume-based gauge economic indicator",
    "How did the policy impact Industrial Production Index?": "Malaysia diesel subsidy reform impact IPI Industrial Production Index June 2024 manufacturing performance trend phases pre-reform immediate-impact medium-term",
    "Which manufacturing industries were most affected?": "Malaysia manufacturing industries sectors most affected diesel price increase subsidy reform fuel sensitivity score non-metallic mineral products wearing apparel paper products",
    "How did companies respond to the policy?": "Malaysia companies manufacturers respond adapt diesel subsidy reform June 2024 stockpiling efficiency measures cost pass-through SME vulnerability",
    "What are the long-term effects on the manufacturing output?": "Malaysia manufacturing output long-term effects diesel subsidy reform 2024 quarterly IPI trends adaptation recovery strategies modernization efficiency"
}

# Internal page mapping for dataset and information pages
INTERNAL_PAGE_MAPPING = {
    # Fuel and Diesel Data
    "fuel data": "/datasets_page/",
    "diesel data": "/datasets_page/",
    "fuel price": "/datasets_page/#diesel-price-tab",
    "diesel price": "/datasets_page/#diesel-price-tab",
    "vehicle data": "/datasets_page/#diesel-vehicles-tab",
    "registered vehicles": "/datasets_page/#diesel-vehicles-tab",
    
    # CPI Data
    "cpi data": "/cpi_dataset/",
    "consumer price index data": "/cpi_dataset/",
    "cpi state map": "/cpi_dataset/#state-data-map-tab",
    "state cpi map": "/cpi_dataset/#state-data-map-tab",
    "mcoicop data": "/cpi_dataset/#mcoicop-tab",
    
    # CPI Impact
    "cpi impact": "/cpi_impact/",
    "price impact calculator": "/cpi_impact/#price-calc-tab",
    "personal price calculator": "/cpi_impact/#price-calc-tab",
    "regional impact": "/cpi_impact/#regional-impact-tab",
    "cpi categories": "/cpi_impact/#regional-impact-tab",
    "regional map": "/cpi_impact/#regional-map-tab",
    
    # Manufacturing Data
    "manufacturing data": "/manufacturing_dataset/",
    "production index": "/manufacturing_dataset/#manu-line-tab",
    "manufacturing divisions": "/manufacturing_dataset/#manu-bar-tab",
    "manufacturing table": "/manufacturing_dataset/#manu-table-tab",
    
    # Manufacturing Impact
    "manufacturing impact": "/manufacturing_impact/",
    "performance trend": "/manufacturing_impact/#overview",
    "fuel-sensitive sectors": "/manufacturing_impact/#sectors",
    "diesel impact analysis": "/manufacturing_impact/#comparison",
    
    # Policy Pages
    "diesel policy": "/diesel_policy/",
    "diesel dilemma": "/diesel_policy/",
    "policy challenge": "/diesel_policy/#challenge-tab",
    "targeted approach": "/diesel_policy/#targeted-tab",
    "financial perspective": "/diesel_policy/#financial-perspective-tab",
    "future outlook": "/diesel_policy/#future-outlook-tab",
    
    # General Pages
    "policies": "/policies/",
    "home": "/index/",
    "chatbot": "/ai_chatbot/"
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
    "What are the most commonly affected sectors?": """
Provide a clear, structured response about the sectors most impacted by Malaysia's diesel subsidy reform, focusing on:

1. Identify the top 4 most affected CPI categories based on percentage impact
2. Explain in 1-2 sentences WHY each sector was heavily impacted (e.g., reliance on diesel for logistics)


Present your response as a ranked list from most affected to least affected. Use clear, direct language that a non-economist would understand. Be specific about the causal relationships between diesel prices and sector impacts.
""",

    "How does the policy impact consumer price index?": """
Provide a concise, informative explanation of how Malaysia's diesel subsidy reform affects the Consumer Price Index (CPI). Your response should:

1. Start with a brief 1-2 sentence overview of the general impact on CPI (average percentage increase)
2. Mention any regional variations in CPI impact (differences between states or urban/rural areas)
3. Briefly explain the causal mechanism (how diesel price increases flow through to consumer prices)

Use clear, straightforward language focused on concrete impacts rather than technical economic terminology. Include at least one specific statistic to illustrate the magnitude of change. Avoid overly detailed breakdowns - focus on the big picture impact that would be most relevant to average citizens.
""",
    "What are the latest CPI values of states?": """
Provide current information about the latest Overall Consumer Price Index (CPI) values across Malaysian states using the latest data from 2025. Your response should:

1. Identify the 3 states with the highest CPI values and identify their CPI values
2. Identify the 3 states with the lowest CPI values and identify their CPI values

Present this information in a clear, organized manner that helps users quickly understand the geographic distribution of consumer prices across Malaysia.

Insert this text after the list "For more information, you can visit our Interactive map showing detailed CPI values for all Malaysian states"

At the end of your response, include this exact HTML link: '<p><strong><a href="/cpi_dataset/#state-data-map-tab">State CPI Map</a></strong></p>'
""",

    "How is the policy going to impact me?": """
Output this exact response without any modifications:

The impact of Malaysia's diesel subsidy reform on you can vary depending on your personal spending habits and location. To help you understand how it specifically affects your finances, we offer an **interactive calculator tool**.

To get a personalized estimate, please visit the <p><strong><a href="/cpi_impact/#price-calc-tab">Personal Price Impact Calculator.</a></strong></p> Once there, follow these steps:
1. Input your typical monthly expenditure on transportation, food, and accommodation.
2. Select your region or location in Malaysia.
3. Review the personalized estimate of how the subsidy reform might influence your monthly expenses.

""",
    "What is Industrial Production Index?": """
Provide a brief 2-3 sentence explanation of the Industrial Production Index (IPI) that includes:
1. A simple definition that a non-economist would understand
2. What it measures (physical production from mining, manufacturing, electricity)
3. Why it's important as an economic indicator (leading GDP by several months)

Keep your response under 75 words. Use straightforward language accessible to the average citizen. Avoid technical economic jargon where possible.

End with a single sentence mentioning that the Department of Statistics Malaysia (DOSM) surveys over 5,000 establishments monthly to collect this data.
""",

    "How did the policy impact Industrial Production Index?": """
Explain the impact of Malaysia's diesel subsidy reform on the Industrial Production Index in three distinct periods:

1. Pre-reform period (January-May 2024): mention specific index values
2. Immediate impact (June-August 2024): describe the spike and initial response 
3. Medium-term adjustment (September-December 2024): explain the gradual decline

Include actual numerical values from the IPI data for each period. Use 1-2 sentences per period maximum.

Format your answer with <p> tags for paragraphs and <strong> tags for key data points and dates.
""",

    "Which manufacturing industries were most affected?": """
List only the 4 most fuel-sensitive manufacturing sectors based on their Fuel Sensitivity Scores, in order of impact. For each sector:

1. State the sector name and its sensitivity score (e.g., "Non-metallic Mineral Products (147.9)")
2. Provide a one-sentence explanation of why this sector was particularly vulnerable

Present this as a numbered list of the top 4 sectors. Use simple, direct language that explains why each sector was vulnerable to diesel price changes in terms anyone can understand.

End with one sentence explaining the common factors that made these sectors vulnerable (energy intensity, transportation dependency, etc.).
""",

    "How did companies respond to the policy?": """
Describe the 4 main ways Malaysian manufacturing companies responded to the diesel subsidy reform, focusing on:

1. Initial responses (June-July 2024): stockpiling and production adjustments
2. Cost management strategies: efficiency measures vs. cost pass-through 
3. Differences between large companies and SMEs in their adaptation approaches
4. Technology and logistics adaptations (if applicable)

Keep each point to 1-2 concise sentences. Use clear, practical language focusing on concrete business responses rather than theoretical impacts.

Format with <p> tags for paragraphs and <strong> tags for key strategy categories.
""",

    "What are the long-term effects on the manufacturing output?": """
Provide a concise explanation of the 3-4 main long-term effects of the diesel subsidy reform on Malaysia's manufacturing output through the end of 2024. Include:

1. The final stabilization level of the IPI compared to pre-reform (with specific numbers)
2. Two significant structural adjustments in the manufacturing sector
3. One unexpected outcome or trend that emerged by December 2024

Use specific data points where available. Avoid vague statements - focus on concrete, measurable impacts that can be directly attributed to the policy change.

End with one forward-looking sentence about what these effects suggest for Malaysia's manufacturing competitiveness in 2025.
"""
}
dash_key = os.getenv("DASHSCOPE_API_KEY")

FORMATTING_SUFFIX = """
Format your answer with proper HTML:
- Use <p> tags for paragraphs
- Use <ol> and <li> tags for numbered lists
- Use <ul> and <li> tags for bullet points
- Use <strong> tags for emphasis

Ensure numbers and formatting in your answer are represented with HTML tags.
"""

# Initialize the LLM for query rewriting
# llm = ChatOpenAI(model="gpt-4.1-nano", temperature=0)
# llm = ChatOpenAI(model="qwen2.5-7b-instruct",openai_api_base='https://dashscope.aliyuncs.com/compatible-mode/v1',api_key=dash_key)
# llm = ChatOpenAI(model="qwen3-8b",openai_api_base='https://dashscope.aliyuncs.com/compatible-mode/v1',api_key=dash_key,extra_body={"enable_thinking": False})
llm = ChatOpenAI(model="qwen-turbo-latest",openai_api_base='https://dashscope.aliyuncs.com/compatible-mode/v1',api_key=dash_key,extra_body={"enable_thinking": False})

# Template for rewriting free-form queries with enhanced context understanding
FREEFORM_REWRITE_TEMPLATE = """
You are a policy-search query optimizer for a Malaysian policy chatbot. 
The chatbot focuses on Malaysia's diesel subsidy policy, CPI impact, and manufacturing effects.

Rewrite the user's question into an optimized search query that:
1. Is focused on retrieving the most relevant information
2. Includes key entities and specific terms
3. Adds relevant context keywords about Malaysia's diesel subsidy policy
4. Is expanded with synonyms and related terms
5. Is concise (under 15 words if possible)

Current topic being discussed: {topic}

User context:
- Question is about Malaysia's diesel subsidy policy implemented in 2024
- Or about CPI (Consumer Price Index) impacts
- Or about manufacturing sector effects

Conversation history:
{history}

Original question: "{question}"

Return ONLY the rewritten search query with no explanation or other text.
"""

# Create the query rewriter chain
query_rewriter_prompt = PromptTemplate(
    input_variables=["question", "history", "topic"],
    template=FREEFORM_REWRITE_TEMPLATE
)

# Template for detecting link requests
LINK_DETECTION_TEMPLATE = """
You are analyzing a user question to determine if they're asking for a link to a dataset or page.

Determine if the user is asking for:
1. A link to a specific dataset
2. A link to view data visualizations
3. A link to a specific page or section on the website
4. Access to any data, charts, or interactive elements

User's question: "{question}"

Respond with only "YES" or "NO".
"""

link_detection_prompt = PromptTemplate(
    input_variables=["question"],
    template=LINK_DETECTION_TEMPLATE
)

# Template for identifying which dataset or page the user is requesting
DATASET_IDENTIFIER_TEMPLATE = """
The user is asking for a link to a dataset or page. Determine which specific dataset or page they want.

Available dataset/page categories:
- Fuel data (fuel prices, diesel prices, vehicle data)
- CPI data (consumer price index, state maps, MCOICOP)
- CPI impact (price calculator, regional impact, categories, maps)
- Manufacturing data (production index, divisions, tables)
- Manufacturing impact (performance trends, sectors, impact analysis)
- Policy pages (diesel policy, challenges, approach, financial, outlook)
- General pages (home, policies, chatbot)

User's question: "{question}"
Conversation history: "{history}"

Respond with only the most specific category name that matches their request. 
Use lowercase and simple terms like "fuel data", "cpi impact", "manufacturing divisions", etc.
If unclear, respond with the general category like "fuel data" or "cpi data".
"""

dataset_identifier_prompt = PromptTemplate(
    input_variables=["question", "history"],
    template=DATASET_IDENTIFIER_TEMPLATE
)

# Enhanced default system prompt with context handling for links and datasets
DEFAULT_SYSTEM_PROMPT = """
You are a helpful assistant that specializes in explaining Malaysia's diesel subsidy policy.
Use the information from the context to provide accurate, clear answers.

Focus on:
1. Explaining the policy details, implementation, and impacts
2. Providing information about eligibility, application process, and benefits
3. Explaining economic impacts including CPI and manufacturing effects
4. Giving helpful guidance related to the policy questions

When the user asks for links, data, charts, or visualizations:
- Direct them to the appropriate page on the website
- Explain what information they can find on that page
- Offer to answer any specific questions they have about the data

If you don't have enough information from the context, acknowledge this limitation
rather than making up information.
""" + FORMATTING_SUFFIX

def get_default_prompt_template():
    """
    Returns the default prompt template for regular queries.
    """
    # System content for default prompt
    system_content = DEFAULT_SYSTEM_PROMPT
    
    # Human template with context and question
    human_template = """
    Use the following pieces of retrieved context to answer the user's question.    
    Do not make up or infer information that is not directly supported by the context.
    
    Context: {context}
    
    Question: {question}
    """
    
    return {
        "system_content": system_content,
        "human_template": human_template
    }

# def extract_topic_from_conversation(conversation):
#     """
#     Analyzes conversation history to identify the main topic being discussed.
    
#     Args:
#         conversation (list): The conversation history
        
#     Returns:
#         str: The identified topic or None if not found
#     """
#     if not conversation or len(conversation) == 0:
#         return None
    
#     # Topic keywords to look for
#     topics = {
#         "diesel": ["diesel", "fuel", "subsidy", "policy", "price", "rm3.35", "reform"],
#         "cpi": ["cpi", "consumer price", "inflation", "price impact", "categories"],
#         "manufacturing": ["manufacturing", "industry", "production", "ipi", "factory"],
#         "calculator": ["calculator", "personal impact", "budget", "estimate", "household"],
#         "eligibility": ["eligibility", "criteria", "qualify", "application", "madani"],
#         "data": ["data", "dataset", "chart", "visualization", "graph", "map"]
#     }
    
#     # Count occurrences of each topic's keywords
#     topic_counts = {topic: 0 for topic in topics}
    
#     # Analyze the last 5 messages (more recent messages carry more weight)
#     recent_messages = conversation[-5:] if len(conversation) >= 5 else conversation
    
#     for msg in recent_messages:
#         content = msg.get("content", "").lower()
        
#         for topic, keywords in topics.items():
#             for keyword in keywords:
#                 if keyword in content:
#                     topic_counts[topic] += 1
    
#     # Find the most frequently mentioned topic
#     max_count = 0
#     main_topic = None
    
#     for topic, count in topic_counts.items():
#         if count > max_count:
#             max_count = count
#             main_topic = topic
    
#     # Only return if there's a clear topic (mentioned at least twice)
#     return main_topic if max_count >= 2 else None

def is_link_request(question):
    """
    Determines if a user question is asking for a link to a dataset or page.
    
    Args:
        question (str): The user's question
        
    Returns:
        bool: True if the question is asking for a link, False otherwise
    """
    try:
        # Simple keyword-based detection first (faster)
        question_lower = question.lower()
        link_keywords = ["link", "url", "website", "page", "dataset", "data", "dashboard", 
                        "show me", "view", "where can i find", "where can i see",
                        "take me to", "go to", "navigate to", "direct me to", "chart", 
                        "visualization", "calculator"]
        
        # Check for basic link request patterns
        for keyword in link_keywords:
            if keyword in question_lower:
                # For more complex cases, use the LLM to double-check
                response = llm.invoke(
                    link_detection_prompt.format(question=question)
                )
                return response.content.strip().upper() == "YES"
        
        return False
    except Exception as e:
        print(f"Error in link request detection: {str(e)}")
        return False

def get_requested_dataset(question, conversation=None):
    """
    Identifies which dataset or page the user is requesting a link to.
    
    Args:
        question (str): The user's question
        conversation (list): Optional conversation history
        
    Returns:
        str: The URL of the requested page, or None if not identified
    """
    try:
        # Format conversation history if available
        history_text = ""
        if conversation and len(conversation) > 0:
            # Take the last 3 exchanges maximum
            recent_history = conversation[-6:] if len(conversation) > 6 else conversation
            history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_history])
        
        # Quick shortcut detection based on exact phrases
        question_lower = question.lower()
        
        # Direct phrases that clearly indicate specific datasets
        if any(phrase in question_lower for phrase in ["fuel price", "diesel price"]):
            return "/datasets_page/#diesel-price-tab"
        elif any(phrase in question_lower for phrase in ["vehicle", "registration", "car"]):
            return "/datasets_page/#diesel-vehicles-tab"
        elif any(phrase in question_lower for phrase in ["price calculator", "personal calculator", "budget calculator"]):
            return "/cpi_impact/#price-calc-tab"
        elif any(phrase in question_lower for phrase in ["cpi map", "state map"]):
            return "/cpi_dataset/#state-data-map-tab"
        elif any(phrase in question_lower for phrase in ["manufacturing division", "manufacturing sector"]):
            return "/manufacturing_dataset/#manu-bar-tab"
        
        # Use the LLM to identify the dataset category for more complex requests
        response = llm.invoke(
            dataset_identifier_prompt.format(
                question=question,
                history=history_text
            )
        )
        
        dataset_category = response.content.strip().lower()
        print(f"Identified dataset category: {dataset_category}")
        
        # Find the best matching URL from our mappings
        best_match = None
        best_match_length = 0
        
        for key, url in INTERNAL_PAGE_MAPPING.items():
            if dataset_category in key or key in dataset_category:
                # Prefer longer matches (more specific)
                if len(key) > best_match_length:
                    best_match = url
                    best_match_length = len(key)
        
        # If no specific match found, look for partial matches
        if not best_match:
            for key, url in INTERNAL_PAGE_MAPPING.items():
                key_parts = key.split()
                for part in key_parts:
                    if part in dataset_category and len(part) > 3:  # Only match on meaningful words
                        if len(part) > best_match_length:
                            best_match = url
                            best_match_length = len(part)
        
        # Extract topic context from conversation if available
        if not best_match and conversation and len(conversation) > 0:
            # Check recent conversation for topic mentions
            topic_keywords = {
                "fuel": "/datasets_page/",
                "diesel": "/diesel_policy/",
                "cpi": "/cpi_dataset/",
                "consumer price": "/cpi_impact/",
                "manufacturing": "/manufacturing_dataset/",
                "policy": "/policies/"
            }
            
            for msg in conversation[-5:]:  # Check last 5 messages
                content = msg.get("content", "").lower()
                for keyword, url in topic_keywords.items():
                    if keyword in content:
                        best_match = url
                        break
                if best_match:
                    break
        
        # Default to a general page if no match found
        return best_match or "/index/"
    
    except Exception as e:
        print(f"Error in dataset identification: {str(e)}")
        return "/index/"  # Return home page as safe default

def create_link_response(page_url, question):
    """
    Creates an HTML response with a link to the requested page.
    
    Args:
        page_url (str): The URL of the page to link to
        question (str): The original user question
        
    Returns:
        str: HTML formatted response with a link
    """
    # Extract the page name from the URL for a more natural response
    page_name = page_url.split('/')[-2] if page_url.split('/')[-1] == '' else page_url.split('/')[-1]
    page_name = page_name.replace('_', ' ').replace('-', ' ').title()
    
    # Handle hash fragments for specific tabs
    if '#' in page_url:
        tab_name = page_url.split('#')[1].replace('-', ' ').replace('tab', '').title()
        page_name = f"{page_name} - {tab_name}"
    
    # Create specific descriptions based on the page type
    description = "This page contains datasets and visualizations related to your query."
    
    if "datasets_page" in page_url:
        description = "This page shows historical diesel prices and vehicle registration data. You can view trends and compare different fuel types."
    elif "diesel_policy" in page_url:
        description = "This page explains Malaysia's 2024 diesel subsidy reform policy, including the challenges, approach, financial impact, and future outlook."
    elif "cpi_dataset" in page_url:
        description = "This page contains CPI (Consumer Price Index) data across different states and categories, with interactive visualizations."
    elif "cpi_impact" in page_url:
        description = "This page shows how the diesel policy impacts consumer prices, with an interactive calculator to estimate personal budget effects."
    elif "manufacturing" in page_url:
        description = "This page provides data on how the diesel subsidy reform affects the manufacturing sector, with industry-specific analysis."
    
    # Create a nicely formatted response with the link
    response = f"""<p>I can help you access that information. Here's a direct link to the relevant page:</p>

<p><a href="{page_url}" class="btn-link" target="_self"><strong>View {page_name}</strong></a></p>

<p>{description}</p>

<p>Is there any specific aspect of the data you'd like me to explain before you visit the page?</p>"""
    
    return response

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
            "human_template": human_template
        }
    return None

def get_optimized_query(original_question, conversation=None, is_predefined=True):
    """
    Returns an optimized search query or handles special request types:
    - For predefined questions, uses the static mapping
    - For link requests, returns a special flag and the page URL
    - For free-form questions, uses the LLM to dynamically rewrite the query
    
    Args:
        original_question (str): The original user question
        conversation (list): Optional conversation history
        is_predefined (bool): Whether this is a predefined question
        
    Returns:
        tuple or str: Either (query, None) for normal queries or 
                      ('__LINK_REQUEST__', url) for link requests
    """
    # For predefined questions, use the static mapping
    if is_predefined:
        return (QUERY_REWRITES.get(original_question, original_question), None)
    
    # Check if this is a link request
    if is_link_request(original_question):
        page_url = get_requested_dataset(original_question, conversation)
        if page_url:
            return ('__LINK_REQUEST__', page_url)
    return (original_question,None)
    
    # For all other free-form questions, use the LLM to rewrite
    # try:
    #     # Format conversation history if available
    #     history_text = ""
    #     if conversation and len(conversation) > 0:
    #         # Take the last 3 exchanges maximum
    #         recent_history = conversation[-6:] if len(conversation) > 6 else conversation
    #         history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_history])
        
    #     # Extract topic from conversation to provide better context
    #     # topic = extract_topic_from_conversation(conversation) or "general"

    #     # Define a simpler rewrite template that just focuses on the core query
    #     BASIC_REWRITE_TEMPLATE = """
    #     Rewrite this question into a more specific search query for retrieving information.
    #     Add relevant keywords related to Malaysia's diesel policy, CPI data, or manufacturing impacts.
    #     Keep it concise and focused (5-10 words).

    #     Original question: "{question}"

    #     Search query:
    #     """

    #     basic_rewrite_prompt = PromptTemplate(
    #                             input_variables=["question"],
    #                             template=BASIC_REWRITE_TEMPLATE
    #                             )
        
    #     # Call the LLM to rewrite the query
    #     rewritten_query = llm.invoke(basic_rewrite_prompt.format(question = original_question))
        
    #     # Extract and return the rewritten query
    #     return (rewritten_query.content.strip(), None)
    # except Exception as e:
    #     print(f"Error in query rewriting: {str(e)}")
    #     # Fall back to original question if rewriting fails
    #     return (original_question, None)