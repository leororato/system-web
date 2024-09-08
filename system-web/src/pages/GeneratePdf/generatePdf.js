const generatePdf = async (content, language) => {
    const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, language }),
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'output.pdf');
        document.body.appendChild(link);
        link.click();
    } else {
        console.error("Erro ao gerar o PDF");
    }
};

// Chamar a função com o conteúdo e idioma desejados
generatePdf('Este é o conteúdo em português', 'pt');
