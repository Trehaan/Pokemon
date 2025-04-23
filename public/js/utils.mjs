export function handleErrors(data,node)
{
    data.errors.forEach(error => {
        const errorLabel = document.createElement("label");
        errorLabel.className = "errorLabel";
        errorLabel.innerText = error;
        node.errors.push(errorLabel);
        node.appendChild(errorLabel);
    });
}

export function clearErrorMessage(node)
{
    console.log("Error list : ",node.errors);
    console.log("Child Nodes : ",node.childNodes);
    node.errors.forEach(errorLabel => {
        node.removeChild(errorLabel);
    });
    node.errors = [];
}

export function switchToInput(tag)
{
    tag.label.style.display = "none";
    tag.input.defaultValue = tag.label.textContent;
    tag.input.style.display = "inline-block";
}

export function switchToLabel(tag)
{
    tag.input.style.display = "none";
    tag.label.textContent = tag.input.value;
    tag.label.style.display = "inline-block";
}