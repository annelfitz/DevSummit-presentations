import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
export { ASTUtils } from '@typescript-eslint/utils';
export declare const isAwaitExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.AwaitExpression & {
    type: AST_NODE_TYPES.AwaitExpression;
};
export declare const isIdentifier: (node: TSESTree.Node | null | undefined) => node is TSESTree.Identifier & {
    type: AST_NODE_TYPES.Identifier;
};
export declare const isVariableDeclarator: (node: TSESTree.Node | null | undefined) => node is (TSESTree.VariableDeclaratorDefiniteAssignment & {
    type: AST_NODE_TYPES.VariableDeclarator;
}) | (TSESTree.VariableDeclaratorMaybeInit & {
    type: AST_NODE_TYPES.VariableDeclarator;
}) | (TSESTree.VariableDeclaratorNoInit & {
    type: AST_NODE_TYPES.VariableDeclarator;
}) | (TSESTree.UsingInForOfDeclarator & {
    type: AST_NODE_TYPES.VariableDeclarator;
}) | (TSESTree.UsingInNormalContextDeclarator & {
    type: AST_NODE_TYPES.VariableDeclarator;
});
export declare const isArrayExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.ArrayExpression & {
    type: AST_NODE_TYPES.ArrayExpression;
};
export declare const isArrowFunctionExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.ArrowFunctionExpression & {
    type: AST_NODE_TYPES.ArrowFunctionExpression;
};
export declare const isBlockStatement: (node: TSESTree.Node | null | undefined) => node is TSESTree.BlockStatement & {
    type: AST_NODE_TYPES.BlockStatement;
};
export declare const isCallExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.CallExpression & {
    type: AST_NODE_TYPES.CallExpression;
};
export declare const isExpressionStatement: (node: TSESTree.Node | null | undefined) => node is TSESTree.ExpressionStatement & {
    type: AST_NODE_TYPES.ExpressionStatement;
};
export declare const isVariableDeclaration: (node: TSESTree.Node | null | undefined) => node is (TSESTree.ConstDeclaration & {
    type: AST_NODE_TYPES.VariableDeclaration;
}) | (TSESTree.LetOrVarDeclaredDeclaration & {
    type: AST_NODE_TYPES.VariableDeclaration;
}) | (TSESTree.LetOrVarNonDeclaredDeclaration & {
    type: AST_NODE_TYPES.VariableDeclaration;
}) | (TSESTree.UsingInForOfDeclaration & {
    type: AST_NODE_TYPES.VariableDeclaration;
}) | (TSESTree.UsingInNormalContextDeclaration & {
    type: AST_NODE_TYPES.VariableDeclaration;
});
export declare const isAssignmentExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.AssignmentExpression & {
    type: AST_NODE_TYPES.AssignmentExpression;
};
export declare const isSequenceExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.SequenceExpression & {
    type: AST_NODE_TYPES.SequenceExpression;
};
export declare const isImportDeclaration: (node: TSESTree.Node | null | undefined) => node is TSESTree.ImportDeclaration & {
    type: AST_NODE_TYPES.ImportDeclaration;
};
export declare const isImportDefaultSpecifier: (node: TSESTree.Node | null | undefined) => node is TSESTree.ImportDefaultSpecifier & {
    type: AST_NODE_TYPES.ImportDefaultSpecifier;
};
export declare const isImportNamespaceSpecifier: (node: TSESTree.Node | null | undefined) => node is TSESTree.ImportNamespaceSpecifier & {
    type: AST_NODE_TYPES.ImportNamespaceSpecifier;
};
export declare const isImportSpecifier: (node: TSESTree.Node | null | undefined) => node is TSESTree.ImportSpecifier & {
    type: AST_NODE_TYPES.ImportSpecifier;
};
export declare const isJSXAttribute: (node: TSESTree.Node | null | undefined) => node is TSESTree.JSXAttribute & {
    type: AST_NODE_TYPES.JSXAttribute;
};
export declare const isLiteral: (node: TSESTree.Node | null | undefined) => node is (TSESTree.BigIntLiteral & {
    type: AST_NODE_TYPES.Literal;
}) | (TSESTree.BooleanLiteral & {
    type: AST_NODE_TYPES.Literal;
}) | (TSESTree.NullLiteral & {
    type: AST_NODE_TYPES.Literal;
}) | (TSESTree.NumberLiteral & {
    type: AST_NODE_TYPES.Literal;
}) | (TSESTree.RegExpLiteral & {
    type: AST_NODE_TYPES.Literal;
}) | (TSESTree.StringLiteral & {
    type: AST_NODE_TYPES.Literal;
});
export declare const isMemberExpression: (node: TSESTree.Node | null | undefined) => node is (TSESTree.MemberExpressionComputedName & {
    type: AST_NODE_TYPES.MemberExpression;
}) | (TSESTree.MemberExpressionNonComputedName & {
    type: AST_NODE_TYPES.MemberExpression;
});
export declare const isNewExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.NewExpression & {
    type: AST_NODE_TYPES.NewExpression;
};
export declare const isObjectExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.ObjectExpression & {
    type: AST_NODE_TYPES.ObjectExpression;
};
export declare const isObjectPattern: (node: TSESTree.Node | null | undefined) => node is TSESTree.ObjectPattern & {
    type: AST_NODE_TYPES.ObjectPattern;
};
export declare const isProperty: (node: TSESTree.Node | null | undefined) => node is (TSESTree.PropertyComputedName & {
    type: AST_NODE_TYPES.Property;
}) | (TSESTree.PropertyNonComputedName & {
    type: AST_NODE_TYPES.Property;
});
export declare const isSpreadElement: (node: TSESTree.Node | null | undefined) => node is TSESTree.SpreadElement & {
    type: AST_NODE_TYPES.SpreadElement;
};
export declare const isRestElement: (node: TSESTree.Node | null | undefined) => node is TSESTree.RestElement & {
    type: AST_NODE_TYPES.RestElement;
};
export declare const isReturnStatement: (node: TSESTree.Node | null | undefined) => node is TSESTree.ReturnStatement & {
    type: AST_NODE_TYPES.ReturnStatement;
};
export declare const isFunctionDeclaration: (node: TSESTree.Node | null | undefined) => node is (TSESTree.FunctionDeclarationWithName & {
    type: AST_NODE_TYPES.FunctionDeclaration;
}) | (TSESTree.FunctionDeclarationWithOptionalName & {
    type: AST_NODE_TYPES.FunctionDeclaration;
});
export declare const isFunctionExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.FunctionExpression & {
    type: AST_NODE_TYPES.FunctionExpression;
};
export declare const isProgram: (node: TSESTree.Node | null | undefined) => node is TSESTree.Program & {
    type: AST_NODE_TYPES.Program;
};
export declare const isTSTypeAliasDeclaration: (node: TSESTree.Node | null | undefined) => node is TSESTree.TSTypeAliasDeclaration & {
    type: AST_NODE_TYPES.TSTypeAliasDeclaration;
};
export declare const isTSInterfaceDeclaration: (node: TSESTree.Node | null | undefined) => node is TSESTree.TSInterfaceDeclaration & {
    type: AST_NODE_TYPES.TSInterfaceDeclaration;
};
export declare const isTSAsExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.TSAsExpression & {
    type: AST_NODE_TYPES.TSAsExpression;
};
export declare const isTSSatisfiesExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.TSSatisfiesExpression & {
    type: AST_NODE_TYPES.TSSatisfiesExpression;
};
export declare const isTSNonNullExpression: (node: TSESTree.Node | null | undefined) => node is TSESTree.TSNonNullExpression & {
    type: AST_NODE_TYPES.TSNonNullExpression;
};
export declare const isMetaProperty: (node: TSESTree.Node | null | undefined) => node is TSESTree.MetaProperty & {
    type: AST_NODE_TYPES.MetaProperty;
};
