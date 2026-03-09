import ast

def analyze_code(code):
    issues = []

    try:
        tree = ast.parse(code)

        for node in ast.walk(tree):

            if isinstance(node, ast.FunctionDef):
                if node.name == "max":
                    issues.append("Function name shadows Python built-in 'max'")

            if isinstance(node, ast.While):
                issues.append("Warning: while loop detected. Check for infinite loop risk.")

        return issues

    except Exception as e:
        return [f"Syntax Error: {str(e)}"]