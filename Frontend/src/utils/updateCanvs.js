const updateCanvas = async (canvasId, elements) => {
  // console.log('Updating canvas with  ',elements);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3030/api/canvas/${canvasId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({ elements }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Canvas update failed:', data);  // Properly log full error response
      throw new Error(data || 'Failed to update canvas');
    }

    console.log('Canvas updated successfully:', data);
  } catch (error) {
    console.error('Error updating canvas:', error);
  }
};
export default updateCanvas;