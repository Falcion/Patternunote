To "cancel" a task, you can write `{0}` or `{}`; if the weights are not indicated by curly braces at all, then the weight of the task will be taken as one (`1`).

You can make `{0}/{}` the main task and assign weights to subtasks, so the main sum for the main task incorporates the subtasks automatically.

You can enter weight indicators in curly brackets:
- Integer (for example, `{1}`)
- Real number (for example, `{1.25}`)
- Nothing (`{}`)
- Additional signs from the list, namely: `*+` (for example, `{*}` or `{+}`). Such tasks are not considered in calculating bar progress.
- Combinations of additional characters and numbers (for example, `{1.33+}` or `{1*}`)

You can also enable "hierarchical mode", in which each subtask, depending on the "depth level" in the list, will have less and less weight (depth level - an indicator of how many steps a list element represents).

Subtask weight formula in hierarchical mode:

\[ K = \frac{W}{1+X} \]

Where:
- \( W \) - initial task weight,
- \( X \) - depth level,
- \( K \) - final task weight.

When the task is on its own, i.e., at zero level, the weight remains the same; otherwise, it decreases according to a hyperbolic function.

You can also enable "header mode" and "Display filename" to include support for headers in calculating progress for each header separately and display the filename respectively.
